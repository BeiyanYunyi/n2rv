import { Switch, styled } from '@mui/material';

const ColoredSwitch = styled(Switch)({
  switchBase: {
    color: '#f50057',
    '&$checked': {
      color: '#3f51b5',
    },
    '&$checked + $track': {
      backgroundColor: '#7986cb',
    },
  },
  checked: {},
  track: {},
});

export default ColoredSwitch;
