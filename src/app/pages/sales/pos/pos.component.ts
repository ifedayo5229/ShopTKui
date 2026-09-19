import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ShopInventoryService } from 'src/app/services/shop-inventory/shop-inventory.service';
import { ProductCategoryService } from 'src/app/services/product-category/product-category.service';
import { SalesService } from 'src/app/services/sales/sales.service';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { ShopInventory } from 'src/app/models/shop-inventory';
import { ProductCategory } from 'src/app/models/product-category';
import { ProcessSaleRequest, PaymentMethod } from 'src/app/models/sale';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';

interface CartItem {
  item: ShopInventory;
  quantity: number;
}

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {
  products: ShopInventory[] = [];
  filteredProducts: ShopInventory[] = [];
  categories: ProductCategory[] = [];
  
  searchTerm = '';
  selectedCategory = '';
  
  cartItems: CartItem[] = [];
  discount = 0;
  paymentMethod: PaymentMethod = PaymentMethod.Cash;
  customerName = '';
  saleDate: Date = new Date();
  maxDate: Date = new Date();
  
  isProcessing = false;

  // Expose enum to template
  PaymentMethod = PaymentMethod;

  constructor(
    private inventoryService: ShopInventoryService,
    private categoryService: ProductCategoryService,
    private salesService: SalesService,
    private tenantContext: TenantContextService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    const shopId = this.tenantContext.currentShop?.id;
    if (shopId) {
      this.categoryService.getByShop(shopId).subscribe({
        next: (response) => {
          const data = getApiData(response);
          if (isApiSuccess(response) && data) {
            this.categories = data;
          }
        }
      });
    }
  }

  loadProducts(): void {
    const shopId = this.tenantContext.currentShop?.id;
    if (shopId) {
      this.inventoryService.getByShop(shopId).subscribe({
        next: (response) => {
          const data = getApiData(response);
          if (isApiSuccess(response) && data) {
            this.products = data.filter(p => p.isActive);
            this.filteredProducts = this.products;
          }
        },
        error: () => {
          this.toastr.error('Failed to load products', 'Error');
        }
      });
    }
  }

  onSearch(): void {
    this.filterProducts();
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterProducts();
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(item => {
      const matchesSearch = !this.searchTerm || 
        item.product.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        item.categoryId?.toString() === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  getStockClass(item: ShopInventory): string {
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity <= item.reorderLevel) return 'low-stock';
    return 'in-stock';
  }

  addToCart(inventoryItem: ShopInventory): void {
    if (inventoryItem.quantity === 0) return;

    const existingItem = this.cartItems.find(ci => ci.item.productId === inventoryItem.productId);
    
    if (existingItem) {
      if (existingItem.quantity < inventoryItem.quantity) {
        existingItem.quantity++;
      } else {
        this.toastr.warning('Cannot add more than available stock', 'Stock Limit');
      }
    } else {
      this.cartItems.push({ item: inventoryItem, quantity: 1 });
    }
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
  }

  increaseQuantity(index: number): void {
    const cartItem = this.cartItems[index];
    if (cartItem.quantity < cartItem.item.quantity) {
      cartItem.quantity++;
    }
  }

  decreaseQuantity(index: number): void {
    const cartItem = this.cartItems[index];
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    }
  }

  updateQuantity(index: number): void {
    const cartItem = this.cartItems[index];
    if (cartItem.quantity < 1) {
      cartItem.quantity = 1;
    }
    if (cartItem.quantity > cartItem.item.quantity) {
      cartItem.quantity = cartItem.item.quantity;
      this.toastr.warning('Quantity adjusted to available stock', 'Stock Limit');
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.discount = 0;
    this.customerName = '';
    this.saleDate = new Date();
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, ci) => sum + (ci.item.price * ci.quantity), 0);
  }

  get tax(): number {
    return this.cartItems.reduce((sum, ci) => {
      if (ci.item.isTaxable && ci.item.taxPercentage > 0) {
        return sum + (ci.item.price * ci.quantity * ci.item.taxPercentage / 100);
      }
      return sum;
    }, 0);
  }

  get total(): number {
    return this.subtotal - this.discount + this.tax;
  }

  processSale(): void {
    if (this.cartItems.length === 0) return;

    this.isProcessing = true;
    const shopId = this.tenantContext.currentShop?.id;

    const request: ProcessSaleRequest = {
      shopId: shopId!,
      customerName: this.customerName || undefined,
      discount: this.discount,
      tax: this.tax,
      paymentMethod: this.paymentMethod,
      saleDate: this.saleDate.toISOString(),
      items: this.cartItems.map(ci => ({
        productId: ci.item.productId,
        quantity: ci.quantity,
        discount: 0
      }))
    };

    this.salesService.processSale(request).subscribe({
      next: (response) => {
        this.isProcessing = false;
        const data = getApiData(response);
        if (isApiSuccess(response) && data) {
          this.toastr.success(`Sale completed! Invoice: ${data.invoiceNumber}`, 'Success');
          this.clearCart();
          this.loadProducts(); // Refresh stock levels
        } else {
          this.toastr.error(response.message || 'Failed to process sale', 'Error');
        }
      },
      error: (err) => {
        this.isProcessing = false;
        const errorMessage = err.error?.message || 'Failed to process sale';
        this.toastr.error(errorMessage, 'Error');
      }
    });
  }
}
