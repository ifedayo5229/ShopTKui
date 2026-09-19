import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionPlan, CreatePlanRequest, UpdatePlanRequest, BillingCycle } from 'src/app/models/subscription';

export interface PlanDialogData {
  plan?: SubscriptionPlan; // null = create, present = edit
}

@Component({
  selector: 'app-plan-dialog',
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Plan' : 'Create Plan' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="plan-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Plan Name</mat-label>
            <input matInput formControlName="name" placeholder="e.g. Starter">
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Code</mat-label>
            <input matInput formControlName="code" placeholder="e.g. STARTER" [readonly]="isEdit">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="What does this plan offer?" rows="2"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Price</mat-label>
            <input matInput type="number" formControlName="price" min="0" step="0.01">
            <span matPrefix>₦&nbsp;</span>
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Billing Cycle</mat-label>
            <mat-select formControlName="billingCycle">
              <mat-option value="Monthly">Monthly</mat-option>
              <mat-option value="Quarterly">Quarterly</mat-option>
              <mat-option value="Yearly">Yearly</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row three-col">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Max Shops</mat-label>
            <input matInput type="number" formControlName="maxShops" min="-1">
            <mat-hint>-1 = Unlimited</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Max Products</mat-label>
            <input matInput type="number" formControlName="maxProducts" min="-1">
            <mat-hint>-1 = Unlimited</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Max Users</mat-label>
            <input matInput type="number" formControlName="maxUsers" min="-1">
            <mat-hint>-1 = Unlimited</mat-hint>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Sort Order</mat-label>
          <input matInput type="number" formControlName="sortOrder" min="0">
        </mat-form-field>

        <!-- Features -->
        <div class="features-section">
          <label class="features-label">Features</label>
          <div class="feature-chips">
            <div class="feature-chip" *ngFor="let feature of features; let i = index">
              <span>{{ feature }}</span>
              <button mat-icon-button (click)="removeFeature(i)" class="remove-feature">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
          <div class="add-feature-row">
            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>Add a feature</mat-label>
              <input matInput [(ngModel)]="newFeature" [ngModelOptions]="{standalone: true}"
                     placeholder="e.g. POS, Inventory, Reports"
                     (keydown.enter)="addFeature(); $event.preventDefault()">
            </mat-form-field>
            <button mat-stroked-button type="button" (click)="addFeature()" [disabled]="!newFeature.trim()">
              <mat-icon>add</mat-icon> Add
            </button>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid || isSaving">
        <mat-spinner *ngIf="isSaving" diameter="18"></mat-spinner>
        <span *ngIf="!isSaving">{{ isEdit ? 'Update' : 'Create' }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .plan-form {
      min-width: 480px;
      padding-top: 8px;
    }

    .form-row {
      display: flex;
      gap: 12px;

      &.three-col .flex-1 {
        flex: 1;
      }
    }

    .flex-1 { flex: 1; }

    .full-width {
      width: 100%;
    }

    .features-section {
      margin-top: 8px;

      .features-label {
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary, #6b7280);
        margin-bottom: 8px;
      }
    }

    .feature-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }

    .feature-chip {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(15, 124, 92, 0.1);
      color: #0f7c5c;
      padding: 4px 8px 4px 12px;
      border-radius: 16px;
      font-size: 13px;

      .remove-feature {
        width: 20px;
        height: 20px;
        line-height: 20px;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
      }
    }

    .add-feature-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;

      button {
        margin-top: 4px;
      }
    }

    mat-dialog-actions {
      padding: 16px 0 0;

      mat-spinner {
        display: inline-block;
      }
    }

    @media (max-width: 600px) {
      .plan-form {
        min-width: unset;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class PlanDialogComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  isSaving = false;
  features: string[] = [];
  newFeature = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PlanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlanDialogData
  ) {
    this.isEdit = !!data?.plan;

    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      billingCycle: ['Monthly', Validators.required],
      maxShops: [1, Validators.required],
      maxProducts: [100, Validators.required],
      maxUsers: [3, Validators.required],
      sortOrder: [1]
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.plan) {
      const plan = this.data.plan;
      this.form.patchValue({
        name: plan.name,
        code: plan.code,
        description: plan.description,
        price: plan.price,
        billingCycle: plan.billingCycle,
        maxShops: plan.maxShops,
        maxProducts: plan.maxProducts,
        maxUsers: plan.maxUsers,
        sortOrder: plan.sortOrder
      });
      this.features = [...(plan.features || [])];
    }
  }

  addFeature(): void {
    const f = this.newFeature?.trim();
    if (f && !this.features.includes(f)) {
      this.features.push(f);
      this.newFeature = '';
    }
  }

  removeFeature(index: number): void {
    this.features.splice(index, 1);
  }

  save(): void {
    if (this.form.invalid) return;

    const val = this.form.value;

    if (this.isEdit) {
      const request: UpdatePlanRequest = {
        id: this.data.plan!.id,
        code: val.code?.toUpperCase() || this.data.plan!.code,
        name: val.name,
        description: val.description,
        price: val.price,
        billingCycle: val.billingCycle,
        maxShops: val.maxShops,
        maxProducts: val.maxProducts,
        maxUsers: val.maxUsers,
        features: this.features,
        sortOrder: val.sortOrder
      };
      this.dialogRef.close({ action: 'update', data: request });
    } else {
      const request: CreatePlanRequest = {
        name: val.name,
        code: val.code.toUpperCase(),
        description: val.description,
        price: val.price,
        billingCycle: val.billingCycle,
        maxShops: val.maxShops,
        maxProducts: val.maxProducts,
        maxUsers: val.maxUsers,
        features: this.features,
        isActive: true,
        sortOrder: val.sortOrder
      };
      this.dialogRef.close({ action: 'create', data: request });
    }
  }
}
