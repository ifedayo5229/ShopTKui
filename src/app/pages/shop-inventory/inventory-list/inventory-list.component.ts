import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ShopInventoryService } from 'src/app/services/shop-inventory/shop-inventory.service';
import { ProductCategoryService } from 'src/app/services/product-category/product-category.service';
import { isApiSuccess, getApiData } from 'src/app/models/api-response';
import { TenantContextService } from 'src/app/services/tenant-context/tenant-context.service';
import { ShopInventory } from 'src/app/models/shop-inventory';
import { ProductCategory } from 'src/app/models/product-category';
import { StockInDialogComponent } from '../stock-in-dialog/stock-in-dialog.component';
import { StockOutDialogComponent } from '../stock-out-dialog/stock-out-dialog.component';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';
import { HistoryDialogComponent } from '../history-dialog/history-dialog.component';
import { EditProductDialogComponent } from '../edit-product-dialog/edit-product-dialog.component';
import { ProductDetailsDialogComponent } from '../product-details-dialog/product-details-dialog.component';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class InventoryListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['product', 'category', 'price', 'stock', 'status', 'actions'];
  dataSource = new MatTableDataSource<ShopInventory>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = false;
  showFilters = false;
  
  // Stats
  totalProducts = 0;
  inStockCount = 0;
  lowStockCount = 0;
  outOfStockCount = 0;

  // Filters
  searchTerm = '';
  selectedCategory = '';
  selectedStockStatus = '';
  categories: ProductCategory[] = [];

  // Pagination
  totalItems = 0;
  pageSize = 10;

  private shopSub!: Subscription;

  constructor(
    private inventoryService: ShopInventoryService,
    private categoryService: ProductCategoryService,
    private tenantContext: TenantContextService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setupFilterPredicate();

    // React to shop changes (handles late-arriving shop context)
    this.shopSub = this.tenantContext.currentShop$.subscribe(shop => {
      if (shop) {
        this.loadCategories();
        this.loadInventory();
      }
    });
  }

  ngOnDestroy(): void {
    this.shopSub?.unsubscribe();
  }

  setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: ShopInventory, filter: string): boolean => {
      const searchMatch = !this.searchTerm || 
        (data.product?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
        (data.sku?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
        (data.category?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);

      const categoryMatch = !this.selectedCategory || 
        data.categoryId?.toString() === this.selectedCategory.toString();

      let statusMatch = true;
      if (this.selectedStockStatus) {
        switch (this.selectedStockStatus) {
          case 'in_stock':
            statusMatch = data.status === 'In Stock';
            break;
          case 'low_stock':
            statusMatch = data.status === 'Low Stock';
            break;
          case 'out_of_stock':
            statusMatch = data.status === 'Out of Stock' || data.quantity === 0;
            break;
        }
      }

      return searchMatch && categoryMatch && statusMatch;
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  loadInventory(): void {
    debugger
    this.isLoading = true;
    const shopId = this.tenantContext.currentShop?.id;

    if (shopId) {
      this.inventoryService.getByShop(shopId).subscribe({
        next: (response) => {
          this.isLoading = false;
          const data = getApiData(response);
          if (isApiSuccess(response) && data) {
            this.dataSource.data = data;
            this.calculateStats(data);
            this.totalItems = data.length;
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Inventory error:', err);
          this.toastr.error('Failed to load inventory', 'Error');
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  calculateStats(inventory: ShopInventory[]): void {
    this.totalProducts = inventory.length;
    this.inStockCount = inventory.filter(i => i.status === 'In Stock').length;
    this.lowStockCount = inventory.filter(i => i.status === 'Low Stock').length;
    this.outOfStockCount = inventory.filter(i => i.status === 'Out of Stock' || i.quantity === 0).length;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onSearch(): void {
    this.dataSource.filter = Date.now().toString(); // Trigger filter update
  }

  onFilterChange(): void {
    this.dataSource.filter = Date.now().toString(); // Trigger filter update
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStockStatus = '';
    this.dataSource.filter = '';
  }

  getStockClass(item: ShopInventory): string {
    if (item.status === 'Out of Stock' || item.quantity === 0) return 'out-of-stock';
    if (item.status === 'Low Stock') return 'low-stock';
    return 'in-stock';
  }

  getStatusClass(item: ShopInventory): string {
    return this.getStockClass(item);
  }

  getStatusText(item: ShopInventory): string {
    return item.status || 'In Stock';
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    // If server-side pagination is needed, call loadInventory here
  }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInventory();
        this.toastr.success('Product added successfully', 'Success');
      }
    });
  }

  openStockInDialog(item: ShopInventory): void {
    const dialogRef = this.dialog.open(StockInDialogComponent, {
      width: '450px',
      data: { inventory: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInventory();
        this.toastr.success('Stock added successfully', 'Success');
      }
    });
  }

  openStockOutDialog(item: ShopInventory): void {
    const dialogRef = this.dialog.open(StockOutDialogComponent, {
      width: '450px',
      data: { inventory: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInventory();
        this.toastr.success('Stock removed successfully', 'Success');
      }
    });
  }

  viewHistory(item: ShopInventory): void {
    this.dialog.open(HistoryDialogComponent, {
      width: '700px',
      maxHeight: '80vh',
      data: { inventory: item }
    });
  }

  editProduct(item: ShopInventory): void {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { product: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInventory();
        this.toastr.success('Product updated successfully', 'Success');
      }
    });
  }

  viewDetails(item: ShopInventory): void {
    this.dialog.open(ProductDetailsDialogComponent, {
      width: '600px',
      maxHeight: '80vh',
      data: { product: item }
    });
  }

  deleteProduct(item: ShopInventory): void {
    // Delete functionality is currently disabled
    this.toastr.info('Delete functionality is currently disabled', 'Info');
  }
}
