// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// constant
const icons = { IconBrandChrome,ErrorOutlineIcon, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: 'OLD ERRORS',
      type: 'item',
      url: '/sample-page',
      breadcrumbs: true
    },
    {
      id: 'documentation',
      title: 'Documentation',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/berry/',
      icon: icons.IconHelp,
      external: true,
      target: true
    }
  ]
};

export default other;
