import { create } from 'zustand';
import { Truck, Violation, SystemConfig, UserRole, Remark } from '../types';
import { storage, initializeMockData, generateId } from '../utils/storage';

interface AppState {
  trucks: Truck[];
  violations: Violation[];
  config: SystemConfig;
  currentRole: UserRole;
  initialized: boolean;

  initialize: () => void;
  addTruck: (truck: Partial<Truck>) => void;
  updateTruck: (id: string, truck: Partial<Truck>) => void;
  deleteTruck: (id: string) => void;
  reorderTrucks: (updates: { id: string; rank: number }[]) => void;

  addViolation: (violation: Partial<Violation>) => void;
  resolveViolation: (id: string) => void;

  addRemark: (truckId: string, remark: Partial<Remark>) => void;
  updateRemark: (truckId: string, remarkId: string, remark: Partial<Remark>) => void;
  deleteRemark: (truckId: string, remarkId: string) => void;

  updateConfig: (config: Partial<SystemConfig>) => void;
  setCurrentRole: (role: UserRole) => void;
  clearAllData: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  trucks: [],
  violations: [],
  config: { id: 'default', minHealthScore: 60, maxConsecutiveSameCategory: 2 },
  currentRole: 'admin',
  initialized: false,

  initialize: () => {
    if (get().initialized) return;
    initializeMockData();
    set({
      trucks: storage.getTrucks(),
      violations: storage.getViolations(),
      config: storage.getConfig(),
      currentRole: (storage.getRole() as UserRole) || 'admin',
      initialized: true,
    });
  },

  addTruck: (truckData) => {
    const maxRank = Math.max(0, ...get().trucks.map(t => t.rank));
    const newTruck: Truck = {
      id: generateId(),
      name: truckData.name || '',
      owner: truckData.owner || '',
      category: truckData.category || '其他',
      healthScore: truckData.healthScore ?? 80,
      rank: maxRank + 1,
      activeViolations: 0,
      licensePlate: truckData.licensePlate || '',
      status: 'active',
      remarks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...get().trucks, newTruck];
    storage.setTrucks(updated);
    set({ trucks: updated });
  },

  updateTruck: (id, truckData) => {
    const updated = get().trucks.map(t =>
      t.id === id ? { ...t, ...truckData, updatedAt: new Date().toISOString() } : t
    );
    storage.setTrucks(updated);
    set({ trucks: updated });
  },

  deleteTruck: (id) => {
    const updated = get().trucks.filter(t => t.id !== id).map((t, i) => ({ ...t, rank: i + 1 }));
    storage.setTrucks(updated);
    set({ trucks: updated });
  },

  reorderTrucks: (updates) => {
    const truckMap = new Map(get().trucks.map(t => [t.id, t]));
    updates.forEach(u => {
      const truck = truckMap.get(u.id);
      if (truck) truck.rank = u.rank;
    });
    const updated = Array.from(truckMap.values()).sort((a, b) => a.rank - b.rank);
    storage.setTrucks(updated);
    set({ trucks: updated });
  },

  addViolation: (violationData) => {
    const newViolation: Violation = {
      id: generateId(),
      truckId: violationData.truckId || '',
      type: violationData.type || '其他',
      description: violationData.description || '',
      inspector: violationData.inspector || '系统',
      createdAt: new Date().toISOString(),
      resolved: false,
    };
    const updatedViolations = [...get().violations, newViolation];
    storage.setViolations(updatedViolations);
    set({ violations: updatedViolations });

    const truck = get().trucks.find(t => t.id === violationData.truckId);
    if (truck) {
      get().updateTruck(violationData.truckId!, { activeViolations: (truck.activeViolations || 0) + 1 });
    }
  },

  resolveViolation: (id) => {
    const updatedViolations = get().violations.map(v =>
      v.id === id ? { ...v, resolved: true, resolvedAt: new Date().toISOString() } : v
    );
    storage.setViolations(updatedViolations);
    set({ violations: updatedViolations });

    const violation = get().violations.find(v => v.id === id);
    if (violation) {
      const remaining = updatedViolations.filter(v => v.truckId === violation.truckId && !v.resolved).length;
      const truck = get().trucks.find(t => t.id === violation.truckId);
      if (truck) {
        get().updateTruck(violation.truckId, { activeViolations: remaining });
      }
    }
  },

  addRemark: (truckId, remarkData) => {
    const truck = get().trucks.find(t => t.id === truckId);
    if (!truck) return;

    const newRemark: Remark = {
      id: generateId(),
      truckId,
      type: remarkData.type || 'suggestion',
      title: remarkData.title || '',
      content: remarkData.content || '',
      author: remarkData.author || '市场管理员',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTrucks = get().trucks.map(t => {
      if (t.id === truckId) {
        return {
          ...t,
          remarks: [...(t.remarks || []), newRemark],
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });

    storage.setTrucks(updatedTrucks);
    set({ trucks: updatedTrucks });
  },

  updateRemark: (truckId, remarkId, remarkData) => {
    const updatedTrucks = get().trucks.map(t => {
      if (t.id === truckId) {
        return {
          ...t,
          remarks: (t.remarks || []).map(r =>
            r.id === remarkId
              ? { ...r, ...remarkData, updatedAt: new Date().toISOString() }
              : r
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });

    storage.setTrucks(updatedTrucks);
    set({ trucks: updatedTrucks });
  },

  deleteRemark: (truckId, remarkId) => {
    const updatedTrucks = get().trucks.map(t => {
      if (t.id === truckId) {
        return {
          ...t,
          remarks: (t.remarks || []).filter(r => r.id !== remarkId),
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });

    storage.setTrucks(updatedTrucks);
    set({ trucks: updatedTrucks });
  },

  updateConfig: (configData) => {
    const updated = { ...get().config, ...configData };
    storage.setConfig(updated);
    set({ config: updated });
  },

  setCurrentRole: (role) => {
    storage.setRole(role);
    set({ currentRole: role });
  },

  clearAllData: () => {
    storage.clearAll();
    set({ trucks: [], violations: [], config: { id: 'default', minHealthScore: 60, maxConsecutiveSameCategory: 2 } });
  },
}));
