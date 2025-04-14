import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

const platformId = inject(PLATFORM_ID);

export function getFromLocalStorageSafe(key: string): string | null {
  if (!isPlatformBrowser(platformId)) return null;
  return localStorage.getItem(key);
}

export function setToLocalStorageSafe(key: string, value: string): void {
  if (!isPlatformBrowser(platformId)) return;
  localStorage.setItem(key, value);
}

export function removeFromLocalStorageSafe(key: string): void {
  if (!isPlatformBrowser(platformId)) return;
  localStorage.removeItem(key);
}
