# ShopTK Backend API — Inventory & Notification Settings

> Endpoints needed for the **Inventory Settings** and **Notification Settings** tabs.  
> All endpoints require `Authorization: Bearer {token}` header.  
> ShopId is passed in the URL. TenantId is resolved from the JWT.  
> Response format uses `requestSuccessful`, `responseCode`, `responseData`.

---

## Response Wrapper

**Success:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": { ... },
  "message": "Success message"
}
```

**Error:**
```json
{
  "requestSuccessful": false,
  "responseCode": "99",
  "responseData": null,
  "message": "Error description"
}
```

---

## 1. GET Shop Settings

```
GET /api/shops/{shopId}/settings
```

Returns all inventory + notification settings for a shop.

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": {
    "shopId": 1,
    "defaultLowStockThreshold": 10,
    "enableLowStockAlerts": true,
    "enableEmailAlerts": false,
    "allowNegativeStock": false,
    "lowStockNotifications": true,
    "dailySalesSummary": false,
    "newUserNotifications": true
  },
  "message": "Settings retrieved successfully."
}
```

If no `ShopSettings` row exists for this shop yet, return defaults:

| Field                      | Default |
|----------------------------|---------|
| `defaultLowStockThreshold` | 10      |
| `enableLowStockAlerts`     | true    |
| `enableEmailAlerts`        | false   |
| `allowNegativeStock`       | false   |
| `lowStockNotifications`    | true    |
| `dailySalesSummary`        | false   |
| `newUserNotifications`     | true    |

---

## 2. INVENTORY SETTINGS ENDPOINTS

### 2.1 Update Default Low Stock Threshold

```
PUT /api/shops/{shopId}/settings/default-low-stock-threshold
Content-Type: application/json
```

Sets the threshold for **ALL products** in the shop.

**Request:**
```json
{
  "value": 15
}
```

| Field | Type   | Required | Validation |
|-------|--------|----------|------------|
| value | number | Yes      | >= 1       |

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": true,
  "message": "Default threshold updated for all products."
}
```

**Backend logic:**
1. `UPDATE ShopSettings SET DefaultLowStockThreshold = @value WHERE ShopId = @shopId`
2. `UPDATE ShopInventory SET ReorderLevel = @value WHERE ShopId = @shopId`
3. Re-evaluate low stock alerts for affected products

---

### 2.2 Toggle Enable Low Stock Alerts

```
PUT /api/shops/{shopId}/settings/enable-low-stock-alerts
Content-Type: application/json
```

**Request:**
```json
{
  "value": true
}
```

| Field | Type    | Required |
|-------|---------|----------|
| value | boolean | Yes      |

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": true,
  "message": "Setting updated successfully."
}
```

---

### 2.3 Toggle Enable Email Alerts

```
PUT /api/shops/{shopId}/settings/enable-email-alerts
Content-Type: application/json
```

**Request:**
```json
{
  "value": true
}
```

| Field | Type    | Required |
|-------|---------|----------|
| value | boolean | Yes      |

**Response:** Same shape as 2.2

---

### 2.4 Toggle Allow Negative Stock

```
PUT /api/shops/{shopId}/settings/allow-negative-stock
Content-Type: application/json
```

**Request:**
```json
{
  "value": false
}
```

| Field | Type    | Required |
|-------|---------|----------|
| value | boolean | Yes      |

**Response:** Same shape as 2.2

---

### 2.5 Get Per-Product Thresholds

```
GET /api/shops/{shopId}/settings/product-thresholds
```

Returns every product in the shop with its current individual threshold.

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": [
    {
      "inventoryId": 1,
      "productId": 10,
      "productName": "Coca-Cola 50cl",
      "sku": "CC-50CL",
      "currentStock": 25,
      "threshold": 10
    },
    {
      "inventoryId": 2,
      "productId": 11,
      "productName": "Indomie Noodles",
      "sku": "IND-001",
      "currentStock": 5,
      "threshold": 15
    }
  ],
  "message": "Product thresholds retrieved successfully."
}
```

**SQL:**
```sql
SELECT 
    si.Id AS InventoryId,
    si.ProductId,
    p.Name AS ProductName,
    p.Sku,
    si.Quantity AS CurrentStock,
    si.ReorderLevel AS Threshold
FROM ShopInventory si
INNER JOIN Products p ON p.Id = si.ProductId
WHERE si.ShopId = @ShopId AND p.IsActive = 1
ORDER BY p.Name
```

---

### 2.6 Update Single Product Threshold

```
PUT /api/shops/{shopId}/settings/product-thresholds/{inventoryId}
Content-Type: application/json
```

Overrides the threshold for one specific product.

**Request:**
```json
{
  "threshold": 20
}
```

| Field     | Type   | Required | Validation |
|-----------|--------|----------|------------|
| threshold | number | Yes      | >= 0       |

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": true,
  "message": "Product threshold updated."
}
```

**Backend logic:**
1. `UPDATE ShopInventory SET ReorderLevel = @threshold WHERE Id = @inventoryId AND ShopId = @shopId`
2. Re-evaluate low stock alert for this product

---

## 3. NOTIFICATION SETTINGS ENDPOINTS

### 3.1 Toggle Low Stock Notifications

```
PUT /api/shops/{shopId}/settings/low-stock-notifications
Content-Type: application/json
```

**Request:**
```json
{
  "value": true
}
```

| Field | Type    | Required |
|-------|---------|----------|
| value | boolean | Yes      |

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": true,
  "message": "Setting updated successfully."
}
```

---

### 3.2 Toggle Daily Sales Summary

```
PUT /api/shops/{shopId}/settings/daily-sales-summary
Content-Type: application/json
```

**Request:**
```json
{
  "value": false
}
```

| Field | Type    | Required |
|-------|---------|----------|
| value | boolean | Yes      |

**Response:** Same shape as 3.1

---

### 3.3 Toggle New User Notifications

```
PUT /api/shops/{shopId}/settings/new-user-notifications
Content-Type: application/json
```

**Request:**
```json
{
  "value": true
}
```

| Field | Type    | Required |
|-------|---------|----------|
| value | boolean | Yes      |

**Response:** Same shape as 3.1

---

## 4. QUICK REFERENCE TABLE

| #   | Method | Endpoint                                                 | Description                       |
|-----|--------|----------------------------------------------------------|-----------------------------------|
| 1   | GET    | /api/shops/{shopId}/settings                             | Get all settings for a shop       |
| 2.1 | PUT    | /api/shops/{shopId}/settings/default-low-stock-threshold | Set default threshold (all prods) |
| 2.2 | PUT    | /api/shops/{shopId}/settings/enable-low-stock-alerts     | Toggle low stock alerts           |
| 2.3 | PUT    | /api/shops/{shopId}/settings/enable-email-alerts         | Toggle email alerts               |
| 2.4 | PUT    | /api/shops/{shopId}/settings/allow-negative-stock        | Toggle negative stock             |
| 2.5 | GET    | /api/shops/{shopId}/settings/product-thresholds          | Get per-product thresholds        |
| 2.6 | PUT    | /api/shops/{shopId}/settings/product-thresholds/{invId}  | Update single product threshold   |
| 3.1 | PUT    | /api/shops/{shopId}/settings/low-stock-notifications     | Toggle low stock notifications    |
| 3.2 | PUT    | /api/shops/{shopId}/settings/daily-sales-summary         | Toggle daily sales summary        |
| 3.3 | PUT    | /api/shops/{shopId}/settings/new-user-notifications      | Toggle new user notifications     |

---

## 5. DATABASE TABLE

```sql
CREATE TABLE ShopSettings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ShopId INT NOT NULL UNIQUE,
    DefaultLowStockThreshold INT NOT NULL DEFAULT 10,
    EnableLowStockAlerts BIT NOT NULL DEFAULT 1,
    EnableEmailAlerts BIT NOT NULL DEFAULT 0,
    AllowNegativeStock BIT NOT NULL DEFAULT 0,
    LowStockNotifications BIT NOT NULL DEFAULT 1,
    DailySalesSummary BIT NOT NULL DEFAULT 0,
    NewUserNotifications BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    FOREIGN KEY (ShopId) REFERENCES Shops(Id)
);
```

Auto-insert a `ShopSettings` row with defaults when a new shop is created.  
Per-product thresholds use the existing `ShopInventory.ReorderLevel` column — no new table needed.
```
PUT /api/tenants/update
Content-Type: application/json
```

**Request Body** (all fields optional — only send what changed):
```json
{
  "businessName": "Updated Business Name",
  "ownerName": "Jane Doe",
  "email": "newemail@business.com",
  "phoneNumber": "08098765432",
  "address": "456 New Street, Lagos",
  "city": "Abuja",
  "state": "FCT",
  "country": "Nigeria",
  "logoUrl": "/uploads/new-logo.png"
}
```

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": {
    "id": 1,
    "tenantId": "a3f1e2b4-...",
    "businessName": "Updated Business Name",
    "ownerName": "Jane Doe",
    "email": "newemail@business.com",
    "phoneNumber": "08098765432",
    "address": "456 New Street, Lagos",
    "city": "Abuja",
    "state": "FCT",
    "country": "Nigeria",
    "logoUrl": "/uploads/new-logo.png",
    "subscriptionPlan": "Professional",
    "hasPaidSubscription": true,
    "subscriptionStatus": "Active",
    "createdDate": "2025-01-15T10:30:00Z"
  },
  "message": "Tenant updated successfully."
}
```

---

## 2. SHOPS

### 2.1 GET All Shops
```
GET /api/shops/all
```

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": [
    {
      "id": 1,
      "tenantId": "a3f1e2b4-...",
      "name": "Main Branch",
      "description": "Headquarters",
      "address": "123 Main St, Lagos",
      "city": "Lagos",
      "state": "Lagos",
      "phoneNumber": "08012345678",
      "logoUrl": null,
      "brandColor": "#6366f1",
      "isMainBranch": true,
      "isActive": true,
      "createdDate": "2025-01-15T10:30:00Z"
    }
  ],
  "message": "Shops retrieved successfully."
}
```

---

### 2.2 GET Shop by ID
```
GET /api/shops/{id}
```

**Response:** Single shop object (same shape as array item above)

---

### 2.3 CREATE Shop
```
POST /api/shops/create
Content-Type: application/json
```

**Request Body** (`name` is required, everything else optional):
```json
{
  "name": "New Branch",
  "description": "Second location",
  "address": "789 Another St, Abuja",
  "city": "Abuja",
  "state": "FCT",
  "phoneNumber": "09011223344",
  "logoUrl": null,
  "brandColor": "#ff6600",
  "isMainBranch": false
}
```

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": {
    "id": 2,
    "tenantId": "a3f1e2b4-...",
    "name": "New Branch",
    "description": "Second location",
    "address": "789 Another St, Abuja",
    "city": "Abuja",
    "state": "FCT",
    "phoneNumber": "09011223344",
    "logoUrl": null,
    "brandColor": "#ff6600",
    "isMainBranch": false,
    "isActive": true,
    "createdDate": "2026-02-13T11:50:00Z"
  },
  "message": "Shop created successfully."
}
```

---

### 2.4 UPDATE Shop
```
PUT /api/shops/update
Content-Type: application/json
```

**Request Body** (`id` required, everything else optional):
```json
{
  "id": 2,
  "name": "Renamed Branch",
  "address": "Updated Address",
  "city": "Abuja",
  "state": "FCT",
  "phoneNumber": "09099887766",
  "brandColor": "#6366f1",
  "isMainBranch": false
}
```

**Response:** Updated shop object

---

### 2.5 DELETE Shop
```
DELETE /api/shops/delete/{id}
```

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": true,
  "message": "Shop deleted successfully."
}
```

---

### 2.6 Upload Shop Logo
```
POST /api/shops/{shopId}/upload-logo
Content-Type: multipart/form-data
```

**Request Body:** Form data with `file` field (image)

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": "/uploads/shops/2/logo.png",
  "message": "Logo uploaded successfully."
}
```

---

## 3. SHOP USERS

### ⚠️ KEY CHANGE: Multi-Shop Assignment

Users can now be assigned to **multiple shops**. This requires a **many-to-many** relationship.

**Database:** Create a junction table `ShopUserShops`:
```sql
CREATE TABLE ShopUserShops (
    ShopUserId INT NOT NULL,
    ShopId INT NOT NULL,
    PRIMARY KEY (ShopUserId, ShopId),
    FOREIGN KEY (ShopUserId) REFERENCES ShopUsers(Id),
    FOREIGN KEY (ShopId) REFERENCES Shops(Id)
);
```

The old `ShopId` column on the `ShopUsers` table can be kept for backward compatibility or removed. The `shopIds` array in the request/response replaces the single `shopId`.

---

### 3.1 GET Users by Shop
```
GET /api/shopusers/by-shop/{shopId}
```

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": [
    {
      "id": 5,
      "tenantId": "a3f1e2b4-...",
      "shopId": 1,
      "shopIds": [1, 2],
      "email": "cashier@example.com",
      "firstName": "Ademodi",
      "lastName": "Seun",
      "phone": "08148347968",
      "role": "Cashier",
      "isActive": true,
      "isLocked": false,
      "lastLoginAt": "2026-02-13T10:00:00Z",
      "createdAt": "2026-01-15T10:30:00Z",
      "shopName": "Main Branch",
      "shopNames": ["Main Branch", "Second Branch"],
      "fullName": "Ademodi Seun"
    }
  ],
  "message": "Users retrieved successfully."
}
```

**Note:** `shopId` and `shopName` are kept for backward compatibility. `shopIds` and `shopNames` are the new fields for multi-shop.

---

### 3.2 CREATE Shop User
```
POST /api/shopusers/create
Content-Type: application/json
```

**Request Body:**
```json
{
  "shopIds": [1, 2],
  "email": "newuser@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "08012345678",
  "role": "Cashier"
}
```

| Field     | Type       | Required | Notes                                              |
|-----------|------------|----------|----------------------------------------------------|
| shopIds   | number[]   | Yes      | Array of shop IDs to assign user to                |
| email     | string     | Yes      | Must be unique within tenant                       |
| password  | string     | Yes      | Min 6 characters                                   |
| firstName | string     | Yes      |                                                    |
| lastName  | string     | Yes      |                                                    |
| phone     | string     | No       |                                                    |
| role      | string     | Yes      | `"ShopManager"`, `"Cashier"`, or `"StockKeeper"`   |

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": {
    "id": 6,
    "tenantId": "a3f1e2b4-...",
    "shopIds": [1, 2],
    "shopNames": ["Main Branch", "Second Branch"],
    "email": "newuser@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "08012345678",
    "role": "Cashier",
    "isActive": true,
    "isLocked": false,
    "createdAt": "2026-02-13T12:00:00Z",
    "fullName": "John Smith"
  },
  "message": "User created successfully."
}
```

---

### 3.3 UPDATE Shop User
```
PUT /api/shopusers/update
Content-Type: application/json
```

**Request Body** (`id` required, everything else optional):
```json
{
  "id": 5,
  "shopIds": [1],
  "firstName": "Ademodi",
  "lastName": "Seun",
  "phone": "08148347968",
  "role": "ShopManager",
  "isActive": true
}
```

| Field     | Type       | Required | Notes                                                   |
|-----------|------------|----------|---------------------------------------------------------|
| id        | number     | Yes      | The user ID                                             |
| shopIds   | number[]   | No       | If provided, replaces ALL shop assignments              |
| firstName | string     | No       |                                                         |
| lastName  | string     | No       |                                                         |
| phone     | string     | No       |                                                         |
| role      | string     | No       | `"ShopManager"`, `"Cashier"`, or `"StockKeeper"`        |
| isActive  | boolean    | No       |                                                         |

**Important:** When `shopIds` is provided, it's a **full replacement** — delete all existing shop assignments for this user, then insert the new ones.

**Response:** Updated user object (same shape as 3.2 response)

---

### 3.4 DELETE Shop User
```
DELETE /api/shopusers/delete/{id}
```

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": true,
  "message": "User deleted successfully."
}
```

---

### 3.5 Lock User (Deactivate)
```
PUT /api/shopusers/lock/{userId}
```

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": true,
  "message": "User locked successfully."
}
```

---

### 3.6 Unlock User (Activate)
```
PUT /api/shopusers/unlock/{userId}
```

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": true,
  "message": "User unlocked successfully."
}
```

---

## 4. SHOP SETTINGS (Inventory & Notifications)

Each setting is updated via its own endpoint. Toggles are saved instantly on change.

---

### 4.1 GET Shop Settings
```
GET /api/shops/{shopId}/settings
```

Returns all inventory + notification settings for a shop.

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": {
    "shopId": 1,
    "defaultLowStockThreshold": 10,
    "enableLowStockAlerts": true,
    "enableEmailAlerts": false,
    "allowNegativeStock": false,
    "lowStockNotifications": true,
    "dailySalesSummary": false,
    "newUserNotifications": true
  },
  "message": "Settings retrieved successfully."
}
```

If settings haven't been created yet for a shop, the backend should return defaults:
- `defaultLowStockThreshold`: 10
- `enableLowStockAlerts`: true
- `enableEmailAlerts`: false
- `allowNegativeStock`: false
- `lowStockNotifications`: true
- `dailySalesSummary`: false
- `newUserNotifications`: true

---

### 4.2 UPDATE Default Low Stock Threshold
```
PUT /api/shops/{shopId}/settings/default-low-stock-threshold
Content-Type: application/json
```

**Important:** This updates the `reorderLevel` / threshold for **ALL products** in the shop's inventory, plus saves the new default for future products.

**Request Body:**
```json
{
  "value": 15
}
```

| Field | Type   | Required | Notes               |
|-------|--------|----------|---------------------|
| value | number | Yes      | Must be >= 1        |

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": true,
  "message": "Default threshold updated for all products."
}
```

**Backend Logic:**
1. Update `ShopSettings.DefaultLowStockThreshold = value`
2. Update ALL `ShopInventory` records for this shop: `SET ReorderLevel = {value} WHERE ShopId = {shopId}`
3. Re-evaluate low stock alerts for affected products

---

### 4.3 UPDATE Enable Low Stock Alerts
```
PUT /api/shops/{shopId}/settings/enable-low-stock-alerts
Content-Type: application/json
```

**Request Body:**
```json
{
  "value": true
}
```

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": true,
  "message": "Setting updated successfully."
}
```

---

### 4.4 UPDATE Enable Email Alerts
```
PUT /api/shops/{shopId}/settings/enable-email-alerts
Content-Type: application/json
```

**Request Body:**
```json
{
  "value": true
}
```

**Response:** Same as 4.3

---

### 4.5 UPDATE Allow Negative Stock
```
PUT /api/shops/{shopId}/settings/allow-negative-stock
Content-Type: application/json
```

**Request Body:**
```json
{
  "value": false
}
```

**Response:** Same as 4.3

---

### 4.6 UPDATE Low Stock Notifications
```
PUT /api/shops/{shopId}/settings/low-stock-notifications
Content-Type: application/json
```

**Request Body:**
```json
{
  "value": true
}
```

**Response:** Same as 4.3

---

### 4.7 UPDATE Daily Sales Summary
```
PUT /api/shops/{shopId}/settings/daily-sales-summary
Content-Type: application/json
```

**Request Body:**
```json
{
  "value": false
}
```

**Response:** Same as 4.3

---

### 4.8 UPDATE New User Notifications
```
PUT /api/shops/{shopId}/settings/new-user-notifications
Content-Type: application/json
```

**Request Body:**
```json
{
  "value": true
}
```

**Response:** Same as 4.3

---

### 4.9 GET Product Thresholds
```
GET /api/shops/{shopId}/settings/product-thresholds
```

Returns all products in the shop with their individual low stock thresholds.

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": [
    {
      "inventoryId": 1,
      "productId": 10,
      "productName": "Coca-Cola 50cl",
      "sku": "CC-50CL",
      "currentStock": 25,
      "threshold": 10
    },
    {
      "inventoryId": 2,
      "productId": 11,
      "productName": "Indomie Noodles",
      "sku": "IND-001",
      "currentStock": 5,
      "threshold": 15
    }
  ],
  "message": "Product thresholds retrieved successfully."
}
```

**Backend SQL (example):**
```sql
SELECT 
    si.Id AS InventoryId,
    si.ProductId,
    p.Name AS ProductName,
    p.Sku,
    si.Quantity AS CurrentStock,
    si.ReorderLevel AS Threshold
FROM ShopInventory si
INNER JOIN Products p ON p.Id = si.ProductId
WHERE si.ShopId = @ShopId AND p.IsActive = 1
ORDER BY p.Name
```

---

### 4.10 UPDATE Product Threshold (Individual)
```
PUT /api/shops/{shopId}/settings/product-thresholds/{inventoryId}
Content-Type: application/json
```

Updates a **single product's** low stock threshold, overriding the default.

**Request Body:**
```json
{
  "threshold": 20
}
```

| Field     | Type   | Required | Notes                        |
|-----------|--------|----------|------------------------------|
| threshold | number | Yes      | Must be >= 0                 |

**Response:**
```json
{
  "requestSuccessful": true,
  "responseCode": "00",
  "responseData": true,
  "message": "Product threshold updated."
}
```

**Backend Logic:**
1. Update `ShopInventory.ReorderLevel = threshold WHERE Id = {inventoryId} AND ShopId = {shopId}`
2. Re-evaluate low stock alert for this product

---

### Database: ShopSettings Table

```sql
CREATE TABLE ShopSettings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ShopId INT NOT NULL UNIQUE,
    DefaultLowStockThreshold INT NOT NULL DEFAULT 10,
    EnableLowStockAlerts BIT NOT NULL DEFAULT 1,
    EnableEmailAlerts BIT NOT NULL DEFAULT 0,
    AllowNegativeStock BIT NOT NULL DEFAULT 0,
    LowStockNotifications BIT NOT NULL DEFAULT 1,
    DailySalesSummary BIT NOT NULL DEFAULT 0,
    NewUserNotifications BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    FOREIGN KEY (ShopId) REFERENCES Shops(Id)
);
```

**Note:** When a shop is created, auto-insert a `ShopSettings` row with defaults. If the GET fails (no row), return the defaults anyway.

---

## 5. QUICK REFERENCE TABLE

| #    | Method   | Endpoint                                                  | Description                       |
|------|----------|-----------------------------------------------------------|-----------------------------------|
| 1.1  | GET      | /api/tenants/profile                                      | Get current tenant profile        |
| 1.2  | GET      | /api/tenants/{id}                                         | Get tenant by ID                  |
| 1.3  | PUT      | /api/tenants/update                                       | Update tenant profile             |
| 2.1  | GET      | /api/shops/all                                            | Get all shops for tenant          |
| 2.2  | GET      | /api/shops/{id}                                           | Get shop by ID                    |
| 2.3  | POST     | /api/shops/create                                         | Create a new shop                 |
| 2.4  | PUT      | /api/shops/update                                         | Update a shop                     |
| 2.5  | DELETE   | /api/shops/delete/{id}                                    | Delete a shop                     |
| 2.6  | POST     | /api/shops/{id}/upload-logo                               | Upload shop logo                  |
| 3.1  | GET      | /api/shopusers/by-shop/{shopId}                           | Get users for a shop              |
| 3.2  | POST     | /api/shopusers/create                                     | Create user (multi-shop)          |
| 3.3  | PUT      | /api/shopusers/update                                     | Update user (multi-shop)          |
| 3.4  | DELETE   | /api/shopusers/delete/{id}                                | Delete a user                     |
| 3.5  | PUT      | /api/shopusers/lock/{userId}                              | Lock/deactivate user              |
| 3.6  | PUT      | /api/shopusers/unlock/{userId}                            | Unlock/activate user              |
| 4.1  | GET      | /api/shops/{shopId}/settings                              | Get all shop settings             |
| 4.2  | PUT      | /api/shops/{shopId}/settings/default-low-stock-threshold  | Set default threshold (all prods) |
| 4.3  | PUT      | /api/shops/{shopId}/settings/enable-low-stock-alerts      | Toggle low stock alerts           |
| 4.4  | PUT      | /api/shops/{shopId}/settings/enable-email-alerts          | Toggle email alerts               |
| 4.5  | PUT      | /api/shops/{shopId}/settings/allow-negative-stock         | Toggle negative stock             |
| 4.6  | PUT      | /api/shops/{shopId}/settings/low-stock-notifications      | Toggle low stock notifications    |
| 4.7  | PUT      | /api/shops/{shopId}/settings/daily-sales-summary          | Toggle daily sales summary        |
| 4.8  | PUT      | /api/shops/{shopId}/settings/new-user-notifications       | Toggle new user notifications     |
| 4.9  | GET      | /api/shops/{shopId}/settings/product-thresholds           | Get per-product thresholds        |
| 4.10 | PUT      | /api/shops/{shopId}/settings/product-thresholds/{invId}   | Update single product threshold   |

---

## 6. ROLE VALUES

The `role` field uses these exact string values:

| Value          | Label        | Access Level                          |
|----------------|--------------|---------------------------------------|
| `SuperAdmin`   | Super Admin  | Platform admin (not assignable by UI) |
| `TenantOwner`  | Owner        | Full tenant access (auto-assigned)    |
| `ShopManager`  | Manager      | Full access to assigned shop(s)       |
| `Cashier`      | Cashier      | Sales, receipts, daily reports        |
| `StockKeeper`  | Stock Keeper | Inventory management, stock alerts    |
| `Viewer`       | Viewer       | Read-only access                      |

The UI only allows assigning: `ShopManager`, `Cashier`, `StockKeeper`.

---

## 7. NOTES

- **TenantId** is automatically resolved from the JWT auth token — never pass it in request body.
- **Partial updates**: For PUT endpoints, only send fields you want to change. Omitted fields keep current values.
- **shopIds replacement**: When updating a user's `shopIds`, treat it as a full replacement (delete old, insert new junction records).
- **Ownership**: Tenants can only access/modify their own data. Attempting to access another tenant's resources returns 404.
- **Response format**: Use `requestSuccessful` + `responseCode` + `responseData` (not `success` + `data`). The frontend handles both formats via helper functions.
