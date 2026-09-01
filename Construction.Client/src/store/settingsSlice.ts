import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TenantSettingsDto } from '@/types';

export interface SettingsState {
  currency: string;
  currencySymbol: string;
  timezone: string;
  dateFormat: string;
  defaultVatRate: number;
  defaultRetentionRate: number;
  defaultDailyWorkingHours: number;
  autoApprovalLimit: number;
  companyName: string;
  taxRegistrationNumber: string;
  contactPhone: string;
  address: string;
}

const storedCurrency = localStorage.getItem('app_currency') || 'LKR';
const storedCurrencySymbol = localStorage.getItem('app_currency_symbol') || (storedCurrency === 'USD' ? '$' : 'Rs.');

const initialState: SettingsState = {
  currency: storedCurrency,
  currencySymbol: storedCurrencySymbol,
  timezone: localStorage.getItem('app_timezone') || 'Asia/Colombo',
  dateFormat: localStorage.getItem('app_date_format') || 'DD/MM/YYYY',
  defaultVatRate: Number(localStorage.getItem('app_vat_rate')) || 18.0,
  defaultRetentionRate: Number(localStorage.getItem('app_retention_rate')) || 5.0,
  defaultDailyWorkingHours: Number(localStorage.getItem('app_working_hours')) || 8,
  autoApprovalLimit: Number(localStorage.getItem('app_auto_approval')) || 50000,
  companyName: localStorage.getItem('app_company_name') || 'Ceylon BuildTech Engineering (Pvt) Ltd',
  taxRegistrationNumber: localStorage.getItem('app_tax_number') || 'PV-00284719 / VAT-11482934',
  contactPhone: localStorage.getItem('app_contact_phone') || '+94 11 288 9400',
  address: localStorage.getItem('app_address') || 'Level 14, Lotus Tower Commercial Complex, Colombo 02, Sri Lanka',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
      state.currencySymbol = action.payload === 'USD' ? '$' : action.payload === 'EUR' ? '€' : action.payload === 'GBP' ? '£' : 'Rs.';
      localStorage.setItem('app_currency', state.currency);
      localStorage.setItem('app_currency_symbol', state.currencySymbol);
    },
    updateSettingsState: (state, action: PayloadAction<Partial<TenantSettingsDto> | Partial<SettingsState>>) => {
      if (action.payload.currency) {
        state.currency = action.payload.currency;
        state.currencySymbol = action.payload.currencySymbol || (action.payload.currency === 'USD' ? '$' : 'Rs.');
        localStorage.setItem('app_currency', state.currency);
        localStorage.setItem('app_currency_symbol', state.currencySymbol);
      }
      if (action.payload.timezone) {
        state.timezone = action.payload.timezone;
        localStorage.setItem('app_timezone', state.timezone);
      }
      if (action.payload.dateFormat) {
        state.dateFormat = action.payload.dateFormat;
        localStorage.setItem('app_date_format', state.dateFormat);
      }
      if (action.payload.defaultVatRate !== undefined) {
        state.defaultVatRate = action.payload.defaultVatRate;
        localStorage.setItem('app_vat_rate', String(state.defaultVatRate));
      }
      if (action.payload.defaultRetentionRate !== undefined) {
        state.defaultRetentionRate = action.payload.defaultRetentionRate;
        localStorage.setItem('app_retention_rate', String(state.defaultRetentionRate));
      }
      if (action.payload.defaultDailyWorkingHours !== undefined) {
        state.defaultDailyWorkingHours = action.payload.defaultDailyWorkingHours;
        localStorage.setItem('app_working_hours', String(state.defaultDailyWorkingHours));
      }
      if (action.payload.autoApprovalLimit !== undefined) {
        state.autoApprovalLimit = action.payload.autoApprovalLimit;
        localStorage.setItem('app_auto_approval', String(state.autoApprovalLimit));
      }
      if (action.payload.companyName) {
        state.companyName = action.payload.companyName;
        localStorage.setItem('app_company_name', state.companyName);
      }
      if (action.payload.taxRegistrationNumber !== undefined) {
        state.taxRegistrationNumber = action.payload.taxRegistrationNumber || '';
        localStorage.setItem('app_tax_number', state.taxRegistrationNumber);
      }
      if (action.payload.contactPhone !== undefined) {
        state.contactPhone = action.payload.contactPhone || '';
        localStorage.setItem('app_contact_phone', state.contactPhone);
      }
      if (action.payload.address !== undefined) {
        state.address = action.payload.address || '';
        localStorage.setItem('app_address', state.address);
      }
    },
  },
});

export const { setCurrency, updateSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;
