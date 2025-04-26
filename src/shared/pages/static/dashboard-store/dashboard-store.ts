'use client';

import { create } from 'zustand';

interface DashboardState {
  selectedDashboardId: string | null;
  setSelectedDashboardId: (id: string | null) => void;
}

const useDashboardStore = create<DashboardState>((set) => ({
  selectedDashboardId: null,
  setSelectedDashboardId: (id) => set({ selectedDashboardId: id }),
}));

export default useDashboardStore;
