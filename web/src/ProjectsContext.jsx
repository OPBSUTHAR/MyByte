import { createContext, useContext } from 'react';

// Minimal project store: the live list + the modal opener. Everything else
// (domain labels, live-url classification) is imported from lib/github
// directly at the call site — no duplicated contract.
export const ProjectsContext = createContext({ list: [], openProject: () => {} });

export const useProjects = () => useContext(ProjectsContext);
