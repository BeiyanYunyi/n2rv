const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const stringAvatar = (name: string) => {
  const reg = /[^\u4e00-\u9fa5]/gi;
  const charactor = name.replace(reg, '');
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${charactor ? charactor.substring(0, 1) : name.substring(0, 2)}`,
  };
};

export default stringAvatar;
