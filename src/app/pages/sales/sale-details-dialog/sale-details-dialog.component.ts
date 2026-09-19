import { Component, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from 'src/app/services/sales/sales.service';
import { Sale, SaleItem, PaymentMethod } from 'src/app/models/sale';

export interface SaleDetailsDialogData {
  sale: Sale;
}

@Component({
  selector: 'app-sale-details-dialog',
  templateUrl: './sale-details-dialog.component.html',
  styleUrls: ['./sale-details-dialog.component.scss']
})
export class SaleDetailsDialogComponent {
  isDownloading = false;
  isPrinting = false;

  @ViewChild('invoiceContent') invoiceContent!: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<SaleDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SaleDetailsDialogData,
    private salesService: SalesService,
    private toastr: ToastrService
  ) {}

  get sale(): Sale {
    return this.data.sale;
  }

  get saleItems(): SaleItem[] {
    return this.sale.items || this.sale.saleItems || [];
  }

  get cashierName(): string {
    return this.sale.soldBy || this.sale.createdBy || 'N/A';
  }

  downloadInvoice(): void {
    this.isDownloading = true;
    
    // Try to use backend endpoint first
    this.salesService.downloadInvoice(this.sale.id).subscribe({
      next: (blob) => {
        this.isDownloading = false;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.sale.invoiceNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success('Invoice downloaded', 'Success');
      },
      error: () => {
        // Fallback to client-side generation
        this.generateClientInvoice();
      }
    });
  }

  private generateClientInvoice(): void {
    this.isDownloading = false;
    
    const printContents = this.getInvoiceHtml();
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(printContents);
      printWindow.document.close();
      
      // Download as HTML (can be printed to PDF)
      const blob = new Blob([printContents], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.sale.invoiceNumber}.html`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      this.toastr.info('Invoice generated. Use Print > Save as PDF for PDF format.', 'Download Ready');
    }
  }

  printInvoice(): void {
    this.isPrinting = true;
    
    const printContents = this.getInvoiceHtml();
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (printWindow) {
      printWindow.document.write(printContents);
      printWindow.document.close();
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          this.isPrinting = false;
        }, 250);
      };
    } else {
      this.isPrinting = false;
      this.toastr.error('Please allow popups to print', 'Print Error');
    }
  }

  private getInvoiceHtml(): string {
    const items = this.saleItems;
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="font-weight: 500;">${item.productName || 'Unknown Product'}</div>
          <div style="font-size: 12px; color: #666;">${item.productSKU || item.productSku || ''}</div>
        </td>
        <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${this.formatCurrency(item.unitPrice)}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee; font-weight: 500;">${this.formatCurrency(item.totalPrice)}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${this.sale.invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 40px; 
            background: #f5f5f5;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .invoice-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 32px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .shop-info h1 { font-size: 24px; margin-bottom: 4px; }
          .shop-info p { opacity: 0.9; font-size: 14px; }
          .invoice-number-box {
            text-align: right;
            background: rgba(255,255,255,0.2);
            padding: 16px 24px;
            border-radius: 8px;
          }
          .invoice-number-box .label { font-size: 12px; opacity: 0.9; }
          .invoice-number-box .number { font-size: 18px; font-weight: 700; margin-top: 4px; }
          .invoice-body { padding: 32px; }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #f0f0f0;
          }
          .info-group h4 {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          .info-group p { font-size: 14px; margin-bottom: 4px; }
          .info-group .highlight { font-weight: 600; color: #333; }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          .items-table th {
            background: #f8f9fa;
            padding: 14px 12px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #666;
            font-weight: 600;
          }
          .items-table th:nth-child(2),
          .items-table th:nth-child(3),
          .items-table th:nth-child(4) { text-align: right; }
          .items-table th:nth-child(2) { text-align: center; }
          .totals-section {
            background: #f8f9fa;
            padding: 24px;
            border-radius: 8px;
            margin-top: 24px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
          }
          .total-row.grand {
            border-top: 2px solid #ddd;
            margin-top: 8px;
            padding-top: 16px;
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
          }
          .payment-badge {
            display: inline-block;
            background: #e3f2fd;
            color: #1976d2;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            padding: 24px;
            background: #fafafa;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { background: white; padding: 0; }
            .invoice-container { box-shadow: none; border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="shop-info">
              <h1>${this.sale.shopName || 'Shop'}</h1>
              <p>Sales Invoice</p>
            </div>
            <div class="invoice-number-box">
              <div class="label">Invoice Number</div>
              <div class="number">${this.sale.invoiceNumber}</div>
            </div>
          </div>
          
          <div class="invoice-body">
            <div class="info-section">
              <div class="info-group">
                <h4>Bill To</h4>
                <p class="highlight">${this.sale.customerName || 'Walk-in Customer'}</p>
                ${this.sale.customerPhone ? `<p>${this.sale.customerPhone}</p>` : ''}
              </div>
              <div class="info-group" style="text-align: right;">
                <h4>Invoice Details</h4>
                <p><strong>Date:</strong> ${this.formatDate(this.sale.saleDate)}</p>
                <p><strong>Cashier:</strong> ${this.cashierName}</p>
                <p><span class="payment-badge">${this.sale.paymentMethod}</span></p>
              </div>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div class="totals-section">
              <div class="total-row">
                <span>Subtotal</span>
                <span>${this.formatCurrency(this.sale.subTotal || this.sale.totalAmount)}</span>
              </div>
              <div class="total-row">
                <span>Discount</span>
                <span style="color: #f44336;">-${this.formatCurrency(this.sale.discount || 0)}</span>
              </div>
              <div class="total-row">
                <span>Tax</span>
                <span>${this.formatCurrency(this.sale.tax || 0)}</span>
              </div>
              <div class="total-row grand">
                <span>Total</span>
                <span>${this.formatCurrency(this.sale.totalAmount)}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p style="margin-top: 8px;">Invoice generated on ${this.formatDate(new Date())}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPaymentMethodIcon(method: PaymentMethod | string): string {
    const icons: Record<string, string> = {
      'Cash': 'payments',
      'Card': 'credit_card',
      'BankTransfer': 'account_balance',
      'MobileMoney': 'phone_android',
      'Credit': 'receipt_long'
    };
    return icons[method] || 'payment';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount || 0);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Receipt methods
  downloadReceipt(): void {
    this.isDownloading = true;
    const receiptHtml = this.getReceiptHtml();
    
    const blob = new Blob([receiptHtml], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${this.sale.invoiceNumber}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    this.isDownloading = false;
    this.toastr.success('Receipt downloaded', 'Success');
  }

  printReceipt(): void {
    this.isPrinting = true;
    
    const printContents = this.getReceiptHtml();
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    
    if (printWindow) {
      printWindow.document.write(printContents);
      printWindow.document.close();
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          this.isPrinting = false;
        }, 250);
      };
    } else {
      this.isPrinting = false;
      this.toastr.error('Please allow popups to print', 'Print Error');
    }
  }

  private getReceiptHtml(): string {
    const items = this.saleItems;
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px dashed #ddd;">
          <div style="font-weight: 500; font-size: 13px;">${item.productName || 'Unknown'}</div>
          <div style="font-size: 11px; color: #666;">${item.quantity} x ${this.formatCurrency(item.unitPrice)}</div>
        </td>
        <td style="padding: 8px 0; text-align: right; border-bottom: 1px dashed #ddd; font-weight: 500;">
          ${this.formatCurrency(item.totalPrice)}
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${this.sale.invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Courier New', monospace; 
            padding: 20px; 
            background: white;
            color: #333;
            max-width: 320px;
            margin: 0 auto;
          }
          .receipt-container {
            background: white;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #333;
            padding-bottom: 16px;
            margin-bottom: 16px;
          }
          .shop-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          .receipt-title {
            font-size: 14px;
            color: #666;
          }
          .meta-info {
            font-size: 12px;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px dashed #ddd;
          }
          .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
          }
          .totals {
            border-top: 2px dashed #333;
            padding-top: 12px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            font-size: 13px;
          }
          .total-row.grand {
            font-size: 18px;
            font-weight: bold;
            border-top: 1px solid #333;
            padding-top: 8px;
            margin-top: 8px;
          }
          .payment-info {
            background: #f5f5f5;
            padding: 12px;
            margin: 16px 0;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 2px dashed #333;
            padding-top: 16px;
            margin-top: 16px;
          }
          .footer p { margin-bottom: 4px; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="shop-name">${this.sale.shopName || 'Shop'}</div>
            <div class="receipt-title">SALES RECEIPT</div>
          </div>
          
          <div class="meta-info">
            <div class="meta-row">
              <span>Receipt #:</span>
              <span>${this.sale.invoiceNumber}</span>
            </div>
            <div class="meta-row">
              <span>Date:</span>
              <span>${this.formatDate(this.sale.saleDate)}</span>
            </div>
            <div class="meta-row">
              <span>Customer:</span>
              <span>${this.sale.customerName || 'Walk-in'}</span>
            </div>
            <div class="meta-row">
              <span>Cashier:</span>
              <span>${this.cashierName}</span>
            </div>
          </div>
          
          <table class="items-table">
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>${this.formatCurrency(this.sale.subTotal || this.sale.totalAmount)}</span>
            </div>
            <div class="total-row">
              <span>Discount</span>
              <span>-${this.formatCurrency(this.sale.discount || 0)}</span>
            </div>
            <div class="total-row">
              <span>Tax</span>
              <span>${this.formatCurrency(this.sale.tax || 0)}</span>
            </div>
            <div class="total-row grand">
              <span>TOTAL</span>
              <span>${this.formatCurrency(this.sale.totalAmount)}</span>
            </div>
          </div>
          
          <div class="payment-info">
            <div class="total-row">
              <span>Payment Method:</span>
              <span>${this.sale.paymentMethod}</span>
            </div>
            ${this.sale.changeGiven > 0 ? `
              <div class="total-row">
                <span>Change:</span>
                <span>${this.formatCurrency(this.sale.changeGiven)}</span>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with us!</p>
            <p>Please keep this receipt for your records.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
