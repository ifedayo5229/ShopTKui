import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  contactForm: FormGroup;
  demoForm: FormGroup;
  showDemoModal = false;
  isSubmitting = false;
  currentYear = new Date().getFullYear();

  features = [
    {
      icon: 'inventory_2',
      title: 'Smart Inventory',
      description: 'Real-time tracking of stock levels, automated alerts for low inventory, and seamless stock management.'
    },
    {
      icon: 'point_of_sale',
      title: 'Point of Sale',
      description: 'Lightning-fast POS system with barcode scanning, multiple payment methods, and instant receipts.'
    },
    {
      icon: 'analytics',
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with sales trends, profit margins, and actionable business insights.'
    },
    {
      icon: 'groups',
      title: 'Multi-User Access',
      description: 'Role-based permissions for your team with complete audit trails and activity logs.'
    },
    {
      icon: 'cloud_sync',
      title: 'Cloud Sync',
      description: 'Access your data anywhere, anytime. Automatic backups and real-time synchronization.'
    },
    {
      icon: 'receipt_long',
      title: 'Smart Reports',
      description: 'Generate detailed reports, export to Excel, and make data-driven decisions effortlessly.'
    }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Retail Store Owner',
      avatar: 'S',
      quote: 'ShopTK transformed how we manage inventory. Stock-outs are now a thing of the past!'
    },
    {
      name: 'Michael Chen',
      role: 'Restaurant Manager',
      quote: 'The POS system is incredibly fast. Our checkout times improved by 40%.',
      avatar: 'M'
    },
    {
      name: 'Amara Okonkwo',
      role: 'Supermarket Chain Owner',
      quote: 'Managing 5 locations from one dashboard is a game-changer. Highly recommended!',
      avatar: 'A'
    }
  ];

  pricingPlans = [
    {
      name: 'Starter',
      price: '0',
      period: 'Forever Free',
      features: ['Up to 100 products', '1 User', 'Basic reports', 'Email support'],
      highlighted: false,
      cta: 'Get Started'
    },
    {
      name: 'Professional',
      price: '29',
      period: 'per month',
      features: ['Unlimited products', '5 Users', 'Advanced analytics', 'Priority support', 'API access'],
      highlighted: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: '99',
      period: 'per month',
      features: ['Everything in Pro', 'Unlimited users', 'Custom integrations', 'Dedicated manager', '24/7 support'],
      highlighted: false,
      cta: 'Contact Sales'
    }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.demoForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: ['', Validators.required],
      phone: [''],
      preferredDate: ['', Validators.required],
      preferredTime: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector((anchor as HTMLAnchorElement).getAttribute('href')!);
        target?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  openDemoModal(): void {
    this.showDemoModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeDemoModal(): void {
    this.showDemoModal = false;
    document.body.style.overflow = 'auto';
  }

  submitContactForm(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      // Simulate API call
      setTimeout(() => {
        this.toastr.success('Thank you for reaching out! We\'ll get back to you soon.', 'Message Sent');
        this.contactForm.reset();
        this.isSubmitting = false;
      }, 1500);
    } else {
      this.toastr.error('Please fill in all required fields correctly.', 'Form Error');
    }
  }

  submitDemoForm(): void {
    if (this.demoForm.valid) {
      this.isSubmitting = true;
      // Simulate API call
      setTimeout(() => {
        this.toastr.success('Demo booked successfully! Check your email for confirmation.', 'Demo Scheduled');
        this.demoForm.reset();
        this.closeDemoModal();
        this.isSubmitting = false;
      }, 1500);
    } else {
      this.toastr.error('Please fill in all required fields correctly.', 'Form Error');
    }
  }
}
