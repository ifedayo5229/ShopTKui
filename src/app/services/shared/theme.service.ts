import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'shop_theme';
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.loadSavedTheme();
  }

  private loadSavedTheme(): void {
    let savedTheme: string | null = null;
    try {
      savedTheme = localStorage.getItem(this.THEME_KEY);
    } catch {
      // Private browsing or blocked site data - fall back to the system setting.
    }
    if (savedTheme === 'dark') {
      this.setDarkMode(true);
    } else if (savedTheme === 'light') {
      this.setDarkMode(false);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDarkMode(prefersDark);
    }
  }

  toggleTheme(): void {
    const newMode = !this.isDarkModeSubject.value;
    this.setDarkMode(newMode);
    try {
      localStorage.setItem(this.THEME_KEY, newMode ? 'dark' : 'light');
    } catch {
      // Not being able to remember the choice is no reason to refuse it.
    }
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);

    // Both values are written explicitly. Removing the attribute for light used
    // to look equivalent, but styles.scss falls back to prefers-color-scheme
    // when no attribute is present - so on a machine set to dark, choosing
    // light removed the attribute and the page stayed dark.
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // Scrollbars, form controls and the like follow this rather than CSS, and
    // otherwise stay light and give the theme away at the edges of the page.
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }

  get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
}
