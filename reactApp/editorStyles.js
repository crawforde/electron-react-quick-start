var styleMap = {};
var styleLabels = {};

const features = [
  {
    prefix: 'SIZE',
    unit: 'px',
    values: [8,10,12,14,16,18,20,22,24,26,28,36,48,72],
    putInStyleMap: (value, self)=> {
      styleMap[`${self.prefix}_${value}`] = {fontSize: `${value}${self.unit}`};
    },
    putInStyleLabels: (value, self)=>{
      styleLabels[`${self.prefix}_${value}`] = `${value}`;
    }
  },
  {
    prefix: 'COLOR',
    values: [
      [0, 0, 0, 1.0, 'Black'],
      [250, 0, 255, 1.0, 'Pink'],
      [255, 0, 0, 1.0, 'Red'],
      [255, 127, 0, 1.0, 'Orange'],
      [180, 180, 0, 1.0, 'Yellow'],
      [0, 180, 0, 1.0, 'Green'],
      [0, 255, 255, 1.0, 'Cyan'],
      [0, 0, 255, 1.0, 'Blue'],
      [0, 0, 139, 1.0, 'Dark Blue'],
      [127, 0, 255, 1.0, 'Violet'],
      [128, 0, 128, 1.0, 'Purple'],
      [139, 69, 19, 1.0, 'Brown'],
      [105, 105, 105, 1.0, 'Grey'],
      [255, 255, 255, 1.0, 'White']
    ],
    putInStyleMap: (value, self)=> {
      styleMap[`${self.prefix}_${value[4].toUpperCase()}`] = {color: `rgba(${value[0]},${value[1]},${value[2]},${value[3]})`};
    },
    putInStyleLabels: (value, self)=>{
      styleLabels[`${self.prefix}_${value[4].toUpperCase()}`] = `${value[4]}`;
    }
  }
];

features.forEach((feature)=>{
  feature.values.forEach((value)=>{
    feature.putInStyleMap(value,feature);
    feature.putInStyleLabels(value,feature);
  });
});

module.exports = {
  styleMap,
  styleLabels
};
