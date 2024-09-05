// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';
import EngineeringIcon from '@mui/icons-material/Engineering';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  EngineeringIcon,
  IconWindmill,
  GppMaybeIcon,
  AccountTreeIcon,
  PrecisionManufacturingIcon
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Machines',
      type: 'item',
      url: '/utils/util-typography',
      icon: icons.PrecisionManufacturingIcon,
      breadcrumbs: false
    },
    {
      id: 'util-operations',
      title: 'Operations',
      type: 'item',
      url: '/utils/util-operations',
      icon: icons.AccountTreeIcon,
      breadcrumbs: false
    },
    {
      id: 'util-machineoperation',
      title: 'Machines/Operations',
      type: 'item',
      url: '/utils/util-machineoperation',
      icon: icons.EngineeringIcon,
      breadcrumbs: false
    },
    {
      id: 'util-color',
      title: 'Errors',
      type: 'item',
      url: '/utils/util-color',
      icon: icons.GppMaybeIcon,
      breadcrumbs: false
    }
  ]
};

export default utilities;
