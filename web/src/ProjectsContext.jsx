import { createContext, useContext } from 'react';

export const ProjectsContext = createContext({ list: [], source: 'curated', openProject: () => {}, live: () => false, domain: () => 'other', domainLabel: (d) => d });

export const useProjects = () => useContext(ProjectsContext);
