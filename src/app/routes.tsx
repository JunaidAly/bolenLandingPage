import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const { Landing } = await import('./pages/LandingReference');
      return { Component: Landing };
    },
  },
  {
    path: '/app',
    Component: Layout,
    children: [
      {
        index: true,
        lazy: async () => {
          const { AgentHome } = await import('./screens/AgentHome');
          return { Component: AgentHome };
        },
      },
      {
        path: 'workflows',
        lazy: async () => {
          const { WorkflowBuilder } = await import('./screens/WorkflowBuilder');
          return { Component: WorkflowBuilder };
        },
      },
      {
        path: 'copilot',
        lazy: async () => {
          const { CoPilot } = await import('./screens/CoPilot');
          return { Component: CoPilot };
        },
      },
      {
        path: 'pipeline',
        lazy: async () => {
          const { PipelineIntel } = await import('./screens/PipelineIntel');
          return { Component: PipelineIntel };
        },
      },
      {
        path: 'reports',
        lazy: async () => {
          const { Reports } = await import('./screens/Reports');
          return { Component: Reports };
        },
      },
      {
        path: 'integrations',
        lazy: async () => {
          const { Integrations } = await import('./screens/Integrations');
          return { Component: Integrations };
        },
      },
    ],
  },
]);
