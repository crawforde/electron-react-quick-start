import { convertToRaw, convertFromRaw } from 'draft-js';

function getStyle(styles, styleType){
  if(!styles || styles.length === 0){
    return false;
  }
  try {
    styles.forEach((styleName)=>{
      if(styleName){
        var arr = styleName.split('_');
        if(arr[0]===styleType){
          throw(styleName);
        }
      }
    });
  } catch(err){
    if (typeof err === 'string'){
      return err;
    }
    console.log('Error:', err);
  }
  return false;
}

function describeStyle(arr){
  var value = arr.pop();
  try{
    arr.forEach((val)=>{
      if(val !== value){
        throw('Mixed Styles');
      }
    });
  } catch(err) {
    return 'mixed';
  }
  return value;
}

function assignDropdownValues(charStyles){
  var color = false;
  var size = false;
  var colors = charStyles.map((styles)=>getStyle(styles,'COLOR'));
  if(colors.length > 0){
    color = describeStyle(colors);
  }
  var sizes = charStyles.map((styles)=>getStyle(styles,'SIZE'));
  if(sizes.length > 0) {
    size = describeStyle(sizes);
  }
  if(!color){
    color = 'mixed';
  }
  if(!size){
    size = 'mixed';
  }
  return {
    COLOR: color,
    SIZE: size
  };
}

function contentFromJSON(rawContentJSON){
  return convertFromRaw(JSON.parse(rawContentJSON));
}

function contentToJSON(content){
  return JSON.stringify(convertToRaw(content));
}

module.exports = {
  getStyle,
  describeStyle,
  assignDropdownValues,
  contentFromJSON,
  contentToJSON
};
