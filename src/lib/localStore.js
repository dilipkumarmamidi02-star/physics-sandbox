/**
 * localStore.js — replaces base44 entity API with localStorage-backed CRUD
 * Drop-in replacement for entities.*
 */

function getCollection(name) {
  try {
    return JSON.parse(localStorage.getItem(`ps_${name}`) || '[]');
  } catch {
    return [];
  }
}

function saveCollection(name, data) {
  localStorage.setItem(`ps_${name}`, JSON.stringify(data));
}

function makeEntity(name) {
  return {
    list: (sortBy, limit) => {
      let items = getCollection(name);
      if (sortBy) {
        const desc = sortBy.startsWith('-');
        const key = desc ? sortBy.slice(1) : sortBy;
        items = [...items].sort((a, b) => {
          if (a[key] < b[key]) return desc ? 1 : -1;
          if (a[key] > b[key]) return desc ? -1 : 1;
          return 0;
        });
      }
      if (limit) items = items.slice(0, limit);
      return Promise.resolve(items);
    },
    filter: (filters, sortBy, limit) => {
      let items = getCollection(name);
      if (filters) {
        items = items.filter(item =>
          Object.entries(filters).every(([k, v]) => item[k] === v)
        );
      }
      if (sortBy) {
        const desc = sortBy.startsWith('-');
        const key = desc ? sortBy.slice(1) : sortBy;
        items = [...items].sort((a, b) => {
          if (a[key] < b[key]) return desc ? 1 : -1;
          if (a[key] > b[key]) return desc ? -1 : 1;
          return 0;
        });
      }
      if (limit) items = items.slice(0, limit);
      return Promise.resolve(items);
    },
    create: (data) => {
      const items = getCollection(name);
      const item = {
        ...data,
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      };
      items.push(item);
      saveCollection(name, items);
      return Promise.resolve(item);
    },
    update: (id, data) => {
      const items = getCollection(name);
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) return Promise.reject(new Error('Not found'));
      items[idx] = { ...items[idx], ...data, updated_date: new Date().toISOString() };
      saveCollection(name, items);
      return Promise.resolve(items[idx]);
    },
    delete: (id) => {
      const items = getCollection(name);
      const filtered = items.filter(i => i.id !== id);
      saveCollection(name, filtered);
      return Promise.resolve({ id });
    },
    get: (id) => {
      const items = getCollection(name);
      const item = items.find(i => i.id === id);
      if (!item) return Promise.reject(new Error('Not found'));
      return Promise.resolve(item);
    },
  };
}

export const entities = {
  User: makeEntity('User'),
  ExperimentSession: makeEntity('ExperimentSession'),
  ExperimentAssignment: makeEntity('ExperimentAssignment'),
  StudentSubmission: makeEntity('StudentSubmission'),
  TeacherStudentLink: makeEntity('TeacherStudentLink'),
};

// Stub for email integration (no-op in standalone mode)
export const integrations = {
  Core: {
    SendEmail: (params) => {
      console.log('[Email stub] Would send email:', params);
      return Promise.resolve({ success: true });
    },
  },
};
