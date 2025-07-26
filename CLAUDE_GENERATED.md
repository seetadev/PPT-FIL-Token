# Claude Generated Code

**Task**: Objective:
Help design and implement new features based on the current roadmap or project needs. Focus on clean, scalable, and testable code

Claude Tasks:

🧩 Feature Implementation
Read the existing codebase and integrate new feature modules where appropriate.

Ensure new code follows existing patterns and conventions.

🗂️ Example Features (replace/add specifics as needed):
Add user role-based access control

Implement export to PDF

Add multi-language support

Enable dark mode toggle

🧪 Testing & Documentation
Add unit/integration tests for new functionality.

Update README or in-code comments if required.

**Generated on**: Sat Jul 26 09:00:29 UTC 2025

## Generated Content

```
I notice there's a mismatch between the task description (Ionic React TypeScript application) and the current codebase (which appears to be a Hardhat/Solidity smart contract project). However, I'll help you create the Ionic React TypeScript frontend application that would interact with your existing smart contracts for government billing/invoicing.

Let me create a comprehensive Ionic React TypeScript application structure:

## FILES_TO_CREATE

### Frontend Application Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── theme/
├── package.json
├── tsconfig.json
├── ionic.config.json
└── capacitor.config.ts
```

## FILES_TO_MODIFY
- Update root `package.json` to include frontend scripts
- Add `.env` template for frontend environment variables

## CODE_CHANGES

### 1. Frontend Package Configuration

**FILES_TO_CREATE**: `frontend/package.json`
```json
{
  "name": "government-billing-frontend",
  "version": "1.0.0",
  "description": "Government Billing/Invoicing Ionic React TypeScript Application",
  "main": "public/index.html",
  "homepage": ".",
  "scripts": {
    "start": "ionic serve",
    "build": "ionic build",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix"
  },
  "dependencies": {
    "@ionic/react": "^7.5.0",
    "@ionic/react-router": "^7.5.0",
    "@capacitor/core": "^5.5.0",
    "@capacitor/camera": "^5.0.7",
    "@capacitor/filesystem": "^5.1.4",
    "@capacitor/preferences": "^5.0.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router": "^6.8.0",
    "react-router-dom": "^6.8.0",
    "ethers": "^6.8.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "i18next": "^23.7.6",
    "react-i18next": "^13.5.0",
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.8.4",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@ionic/cli": "^7.1.5",
    "@capacitor/cli": "^5.5.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@types/react-router": "^5.1.20",
    "@types/react-router-dom": "^5.3.3",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.0",
    "eslint": "^8.53.0",
    "eslint-plugin-react": "^7.33.2",
    "typescript": "^5.2.2",
    "vite": "^4.5.0",
    "vitest": "^0.34.6",
    "@vitest/coverage-v8": "^0.34.6"
  }
}
```

**FILES_TO_CREATE**: `frontend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/pages/*": ["src/pages/*"],
      "@/types/*": ["src/types/*"],
      "@/services/*": ["src/services/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2. Core Types and Interfaces

**FILES_TO_CREATE**: `frontend/src/types/index.ts`
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  walletAddress?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  BILLING_MANAGER = 'billing_manager',
  DEPARTMENT_USER = 'department_user',
  VIEWER = 'viewer'
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: InvoiceItem[];
  totalAmount: number;
  taxAmount: number;
  status: InvoiceStatus;
  dueDate: Date;
  createdAt: Date;
  createdBy: string;
  blockchainTxHash?: string;
  pdfUrl?: string;
  department: string;
  notes?: string;
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  currency: string;
  taxRate: number;
  companyInfo: CompanyInfo;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  taxId: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RolePermissions {
  canCreateInvoice: boolean;
  canEditInvoice: boolean;
  canDeleteInvoice: boolean;
  canViewAllInvoices: boolean;
  canManageUsers: boolean;
  canExportData: boolean;
  canAccessSettings: boolean;
}
```

### 3. Authentication and State Management

**FILES_TO_CREATE**: `frontend/src/hooks/useAuth.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, UserRole, RolePermissions } from '@/types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  getPermissions: () => RolePermissions;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock authentication - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: '1',
            email,
            name: 'John Doe',
            role: UserRole.ADMIN,
            department: 'Finance',
            isActive: true,
            createdAt: new Date(),
            lastLogin: new Date()
          };

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            error: 'Login failed. Please check your credentials.',
            isLoading: false
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      getPermissions: (): RolePermissions => {
        const user = get().user;
        if (!user) {
          return {
            canCreateInvoice: false,
            canEditInvoice: false,
            canDeleteInvoice: false,
            canViewAllInvoices: false,
            canManageUsers: false,
            canExportData: false,
            canAccessSettings: false
          };
        }

        switch (user.role) {
          case UserRole.ADMIN:
            return {
              canCreateInvoice: true,
              canEditInvoice: true,
              canDeleteInvoice: true,
              canViewAllInvoices: true,
              canManageUsers: true,
              canExportData: true,
              canAccessSettings: true
            };
          case UserRole.BILLING_MANAGER:
            return {
              canCreateInvoice: true,
              canEditInvoice: true,
              canDeleteInvoice: true,
              canViewAllInvoices: true,
              canManageUsers: false,
              canExportData: true,
              canAccessSettings: false
            };
          case UserRole.DEPARTMENT_USER:
            return {
              canCreateInvoice: true,
              canEditInvoice: true,
              canDeleteInvoice: false,
              canViewAllInvoices: false,
              canManageUsers: false,
              canExportData: false,
              canAccessSettings: false
            };
          default:
            return {
              canCreateInvoice: false,
              canEditInvoice: false,
              canDeleteInvoice: false,
              canViewAllInvoices: false,
              canManageUsers: false,
              canExportData: false,
              canAccessSettings: false
            };
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
```

### 4. Theme and Settings Management

**FILES_TO_CREATE**: `frontend/src/hooks/useSettings.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings } from '@/types';

interface SettingsStore extends AppSettings {
  updateTheme: (theme: 'light' | 'dark' | 'auto') => void;
  updateLanguage: (language: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleDarkMode: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      theme: 'auto',
      language: 'en',
      currency: 'USD',
      taxRate: 0.1,
      companyInfo: {
        name: 'Government Department',
        address: '123 Government St, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: 'billing@government.gov',
        taxId: 'TAX123456789'
      },

      updateTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('ion-palette-dark', 
          theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        );
      },

      updateLanguage: (language) => {
        set({ language });
      },

      updateSettings: (settings) => {
        set({ ...get(), ...settings });
      },

      toggleDarkMode: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        get().updateTheme(newTheme);
      }
    }),
    {
      name: 'settings-storage'
    }
  )
);
```

### 5. Invoice Service with Blockchain Integration

**FILES_TO_CREATE**: `frontend/src/services/InvoiceService.ts`
```typescript
import { ethers } from 'ethers';
import { Invoice, InvoiceStatus } from '@/types';

class InvoiceService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private readonly contractAddress = '0xYourContractAddress'; // Replace with your deployed contract address

  // Contract ABI - simplified version
  private readonly contractABI = [
    "function submitInvoice(uint256 amount, string memory clientHash) external returns (uint256)",
    "function getInvoice(uint256 invoiceId) external view returns (uint256, string, address, uint256)",
    "function payInvoice(uint256 invoiceId) external payable"
  ];

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  async connectWallet(): Promise<string | null> {
    if (!this.provider) {
      throw new Error('Ethereum wallet not found');
    }

    try {
      await this.provider.send('eth_requestAccounts', []);
      const signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(this.contractAddress, this.contractABI, signer);
      return await signer.getAddress();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return null;
    }
  }

  async submitInvoiceToBlockchain(invoice: Invoice): Promise<string> {
    if (!this.contract) {
      await this.connectWallet();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const clientHash = ethers.keccak256(
        ethers.toUtf8Bytes(`${invoice.clientName}-${invoice.clientEmail}`)
      );

      const tx = await this.contract.submitInvoice(
        ethers.parseEther(invoice.totalAmount.toString()),
        clientHash
      );

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Failed to submit invoice to blockchain:', error);
      throw new Error('Blockchain submission failed');
    }
  }

  async createInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: this.generateId(),
      createdAt: new Date()
    };

    try {
      // Submit to blockchain
      const txHash = await this.submitInvoiceToBlockchain(newInvoice);
      newInvoice.blockchainTxHash = txHash;

      // Save to local storage or API
      await this.saveInvoiceLocally(newInvoice);
      
      return newInvoice;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw new Error('Invoice creation failed');
    }
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    const invoices = await this.getAllInvoices();
    const index = invoices.findIndex(inv => inv.id === id);
    
    if (index === -1) {
      throw new Error('Invoice not found');
    }

    const updatedInvoice = { ...invoices[index], ...updates };
    invoices[index] = updatedInvoice;
    
    await this.saveInvoicesLocally(invoices);
    return updatedInvoice;
  }

  async getAllInvoices(): Promise<Invoice[]> {
    const stored = localStorage.getItem('invoices');
    return stored ? JSON.parse(stored) : [];
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const invoices = await this.getAllInvoices();
    return invoices.find(inv => inv.id === id) || null;
  }

  async deleteInvoice(id: string): Promise<boolean> {
    const invoices = await this.getAllInvoices();
    const filtered = invoices.filter(inv => inv.id !== id);
    
    if (filtered.length === invoices.length) {
      return false; // Invoice not found
    }

    await this.saveInvoicesLocally(filtered);
    return true;
  }

  private async saveInvoiceLocally(invoice: Invoice): Promise<void> {
    const invoices = await this.getAllInvoices();
    invoices.push(invoice);
    await this.saveInvoicesLocally(invoices);
  }

  private async saveInvoicesLocally(invoices: Invoice[]): Promise<void> {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }

  private generateId(): string {
    return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const invoiceService = new InvoiceService();
```

### 6. PDF Export Service

**FILES_TO_CREATE**: `frontend/src/services/PdfService.ts`
```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice } from '@/types';
import { useSettingsStore } from '@/hooks/useSettings';

class PdfService {
  async exportInvoiceToPdf(invoice: Invoice): Promise<Blob> {
    const pdf = new jsPDF();
    const settings = useSettingsStore.getState();
    const { companyInfo } = settings;

    // Company header
    pdf.setFontSize(20);
    pdf.text(companyInfo.name, 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(companyInfo.address, 20, 45);
    pdf.text(`Phone: ${companyInfo.phone}`, 20, 55);
    pdf.text(`Email: ${companyInfo.email}`, 20, 65);
    pdf.text(`Tax ID: ${companyInfo.taxId}`, 20, 75);

    // Invoice details
    pdf.setFontSize(16);
    pdf.text('INVOICE', 150, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Invoice #: ${invoice.invoiceNumber}`, 150, 45);
    pdf.text(`Date: ${invoice.createdAt.toLocaleDateString()}`, 150, 55);
    pdf.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`, 150, 65);
    pdf.text(`Status: ${invoice.status.toUpperCase()}`, 150, 75);

    // Client information
    pdf.text('Bill To:', 20, 100);
    pdf.text(invoice.clientName, 20, 115);
    pdf.text(invoice.clientEmail, 20, 125);
    pdf.text(invoice.clientAddress, 20, 135, { maxWidth: 100 });

    // Items table
    let yPosition = 160;
    pdf.setFontSize(14);
    pdf.text('Items', 20, yPosition);

    yPosition += 15;
    pdf.setFontSize(10);
    pdf.text('Description', 20, yPosition);
    pdf.text('Qty', 120, yPosition);
    pdf.text('Unit Price', 140, yPosition);
    pdf.text('Total', 170, yPosition);

    yPosition += 10;
    pdf.line(20, yPosition, 190, yPosition); // Horizontal line

    yPosition += 10;
    invoice.items.forEach(item => {
      pdf.text(item.description, 20, yPosition, { maxWidth: 90 });
      pdf.text(item.quantity.toString(), 120, yPosition);
      pdf.text(`$${item.unitPrice.toFixed(2)}`, 140, yPosition);
      pdf.text(`$${item.totalPrice.toFixed(2)}`, 170, yPosition);
      yPosition += 15;
    });

    // Totals
    yPosition += 10;
    const subtotal = invoice.totalAmount - invoice.taxAmount;
    pdf.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, yPosition);
    yPosition += 10;
    pdf.text(`Tax: $${invoice.taxAmount.toFixed(2)}`, 140, yPosition);
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.text(`Total: $${invoice.totalAmount.toFixed(2)}`, 140, yPosition);

    // Blockchain hash if available
    if (invoice.blockchainTxHash) {
      yPosition += 20;
      pdf.setFontSize(8);
      pdf.text(`Blockchain TX: ${invoice.blockchainTxHash}`, 20, yPosition);
    }

    return new Blob([pdf.output('blob')], { type: 'application/pdf' });
  }

  async exportElementToPdf(elementId: string, filename: string): Promise<Blob> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return new Blob([pdf.output('blob')], { type: 'application/pdf' });
  }

  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const pdfService = new PdfService();
```

### 7. Internationalization Setup

**FILES_TO_CREATE**: `frontend/src/i18n/index.ts`
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      invoices: 'Invoices',
      clients: 'Clients',
      settings: 'Settings',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      export: 'Export',
      search: 'Search',
      filter: 'Filter',
      
      // Invoice
      invoiceNumber: 'Invoice Number',
      clientName: 'Client Name',
      clientEmail: 'Client Email',
      dueDate: 'Due Date',
      totalAmount: 'Total Amount',
      status: 'Status',
      createInvoice: 'Create Invoice',
      exportToPdf: 'Export to PDF',
      
      // Status
      draft: 'Draft',
      pending: 'Pending',
      paid: 'Paid',
      overdue: 'Overdue',
      cancelled: 'Cancelled',
      
      // Settings
      appearance: 'Appearance',
      language: 'Language',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      autoMode: 'Auto Mode',
      
      // Auth
      login: 'Login',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      
      // Messages
      invoiceCreated: 'Invoice created successfully',
      invoiceUpdated: 'Invoice updated successfully',
      invoiceDeleted: 'Invoice deleted successfully',
      exportSuccess: 'Export completed successfully',
      loginFailed: 'Login failed. Please check your credentials.',
      accessDenied: 'Access denied. Insufficient permissions.'
    }
  },
  es: {
    translation: {
      // Navigation
      dashboard: 'Panel de Control',
      invoices: 'Facturas',
      clients: 'Clientes',
      settings: 'Configuración',
      
      // Common
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      create: 'Crear',
      export: 'Exportar',
      search: 'Buscar',
      filter: 'Filtrar',
      
      // Invoice
      invoiceNumber: 'Número de Factura',
      clientName: 'Nombre del Cliente',
      clientEmail: 'Email del Cliente',
      dueDate: 'Fecha de Vencimiento',
      totalAmount: 'Monto Total',
      status: 'Estado',
      createInvoice: 'Crear Factura',
      exportToPdf: 'Exportar a PDF',
      
      // Settings
      appearance: 'Apariencia',
      language: 'Idioma',
      darkMode: 'Modo Oscuro',
      lightMode: 'Modo Claro',
      autoMode: 'Modo Automático'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### 8. Main Application Component

**FILES_TO_CREATE**: `frontend/src/App.tsx`
```tsx
import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useTranslation } from 'react-i18next';

import Menu from '@/components/Menu';
import Dashboard from '@/pages/Dashboard';
import InvoiceList from '@/pages/InvoiceList';
import InvoiceDetail from '@/pages/InvoiceDetail';
import CreateInvoice from '@/pages/CreateInvoice';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';

import { useAuthStore } from '@/hooks/useAuth';
import { useSettingsStore } from '@/hooks/useSettings';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';
import './i18n';

setupIonicReact();

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { theme, updateTheme } = useSettingsStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Apply theme on app load
    updateTheme(theme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        updateTheme('auto');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, updateTheme]);

  if (!isAuthenticated) {
    return (
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>
            <Route exact path="/invoices">
              <InvoiceList />
            </Route>
            <Route exact path="/invoices/create">
              <CreateInvoice />
            </Route>
            <Route exact path="/invoices/:id">
              <InvoiceDetail />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
```

### 9. Responsive Menu Component

**FILES_TO_CREATE**: `frontend/
```
