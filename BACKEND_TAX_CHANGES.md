# Backend Changes Required: Product Tax Feature

## Overview

The frontend now supports **per-product tax** with a taxable toggle and tax percentage. The POS auto-calculates tax based on each product's tax configuration. The backend needs to store and return these fields.

---

## 1. Product Entity

Add two new columns to the `Product` table/entity:

```csharp
public bool IsTaxable { get; set; } = false;
public decimal TaxPercentage { get; set; } = 0;
```

### Database Migration

```sql
ALTER TABLE Products ADD IsTaxable BIT NOT NULL DEFAULT 0;
ALTER TABLE Products ADD TaxPercentage DECIMAL(5,2) NOT NULL DEFAULT 0;
```

Or via EF Core migration:

```csharp
migrationBuilder.AddColumn<bool>(
    name: "IsTaxable",
    table: "Products",
    type: "bit",
    nullable: false,
    defaultValue: false);

migrationBuilder.AddColumn<decimal>(
    name: "TaxPercentage",
    table: "Products",
    type: "decimal(5,2)",
    nullable: false,
    defaultValue: 0m);
```

---

## 2. DTOs to Update

### CreateProductRequest DTO

```csharp
public bool IsTaxable { get; set; } = false;
public decimal TaxPercentage { get; set; } = 0;
```

### UpdateProductRequest DTO

```csharp
public bool IsTaxable { get; set; } = false;
public decimal TaxPercentage { get; set; } = 0;
```

### Product Response / ShopInventory Response DTO

Ensure `IsTaxable` and `TaxPercentage` are included in the product/inventory response so the POS can read them:

```csharp
public bool IsTaxable { get; set; }
public decimal TaxPercentage { get; set; }
```

---

## 3. Service Layer Changes

### Create Product Handler

Map the new fields from request to entity:

```csharp
var product = new Product
{
    // ... existing fields ...
    IsTaxable = request.IsTaxable,
    TaxPercentage = request.IsTaxable ? request.TaxPercentage : 0
};
```

### Update Product Handler

```csharp
product.IsTaxable = request.IsTaxable;
product.TaxPercentage = request.IsTaxable ? request.TaxPercentage : 0;
```

### GetByShop / Inventory Query

Ensure the inventory projection includes:

```csharp
IsTaxable = p.IsTaxable,
TaxPercentage = p.TaxPercentage
```

---

## 4. Validation Rules

- `TaxPercentage` must be between 0 and 100
- If `IsTaxable` is `false`, `TaxPercentage` should be set to 0 (server-side normalization)
- `TaxPercentage` supports up to 2 decimal places (e.g., 7.50 for VAT)

```csharp
RuleFor(x => x.TaxPercentage)
    .InclusiveBetween(0, 100)
    .When(x => x.IsTaxable);
```

---

## 5. Tax Calculation in Sales (Optional Server Validation)

The frontend sends a pre-computed `tax` total in `ProcessSaleRequest`. For server-side validation, you can recalculate:

```csharp
decimal calculatedTax = saleItems.Sum(item =>
{
    var product = products.First(p => p.Id == item.ProductId);
    if (product.IsTaxable && product.TaxPercentage > 0)
        return item.Quantity * product.SellingPrice * product.TaxPercentage / 100;
    return 0;
});

// Optionally validate: Math.Abs(request.Tax - calculatedTax) < 0.01m
```

---

## 6. Summary of Changes

| Area | Change |
|------|--------|
| **Product Entity** | Add `IsTaxable` (bool, default false) and `TaxPercentage` (decimal(5,2), default 0) |
| **Database** | Migration to add 2 columns to Products table |
| **CreateProductRequest** | Add `IsTaxable` and `TaxPercentage` fields |
| **UpdateProductRequest** | Add `IsTaxable` and `TaxPercentage` fields |
| **Inventory Response DTO** | Include `IsTaxable` and `TaxPercentage` in shop inventory response |
| **Create/Update Handlers** | Map new fields, normalize TaxPercentage to 0 when not taxable |
| **Validation** | TaxPercentage between 0-100, required only when IsTaxable=true |
| **ProcessSale** | (Optional) Server-side tax recalculation for validation |
