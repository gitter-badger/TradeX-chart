// number.js

// Getting a random number between 0 (inclusive) and 1 (exclusive)
export function getRandom() {
  return Math.random();
}

// Getting a random number between two values
// inclusive of the minimum, exclusive of the maximum
export function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}

// Getting a random integer between two values
// inclusive of the minimum, exclusive of the maximum
export function getRandomIntBetween(min, max) {
  min = Math.ceil(min) + 1;
  max = Math.floor(max);
  //The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min); 
}

// Getting a random integer between two values, inclusive
// inclusive of the minimum, inclusive of the maximum
export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

/**
 * Binary search for the closest number
 * @param dataList
 * @param valueKey
 * @param targetNumber
 * @return {number}
 */
 export function binarySearchNearest (dataList, valueKey, targetNumber) {
  let left = 0
  let right = 0
  for (right = dataList.length - 1; left !== right;) {
    const midIndex = Math.floor((right + left) / 2)
    const mid = right - left
    const midValue = dataList[midIndex][valueKey]
    if (targetNumber === dataList[left][valueKey]) {
      return left
    }
    if (targetNumber === dataList[right][valueKey]) {
      return right
    }
    if (targetNumber === midValue) {
      return midIndex
    }

    if (targetNumber > midValue) {
      left = midIndex
    } else {
      right = midIndex
    }

    if (mid <= 2) {
      break
    }
  }
  return left
}

/**
 * binary search on array
 *
 * @export
 * @param {array} list
 * @param {number} item
 * @return {number} - array index
 */
export function binarySearch(list, item) {
  let low = 0
  let high = list.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const guess = list[mid]

    if (guess === item) {
      return mid
    }

    if (guess > item) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return null //if not found
}

/**
 * Optimize numbers
 * @param value
 * @return {number|number}
 */
export function nice (value) {
  const exponent = Math.floor(log10(value))
  const exp10 = index10(exponent)
  const f = value / exp10 // 1 <= f < 10
  let nf = 0
  if (f < 1.5) {
    nf = 1
  } else if (f < 2.5) {
    nf = 2
  } else if (f < 3.5) {
    nf = 3
  } else if (f < 4.5) {
    nf = 4
  } else if (f < 5.5) {
    nf = 5
  } else if (f < 6.5) {
    nf = 6
  } else {
    nf = 8
  }
  value = nf * exp10
  return exponent >= -20 ? +value.toFixed(exponent < 0 ? -exponent : 0) : value
}

/**
 *
 *
 * @export
 * @param {number} value
 * @return {*}  
 */
export function countDigits(value) {
  const digits = {}
  digits.value = value
  digits.sign = (!value) ? false : true
  digits.integers = numDigits(value)
  digits.decimals = precision(value)
  digits.total = digits.integers + digits.decimals
  return digits
}

/**
 * count integer digits
 * bitwise operations in JavaScript only work with 32-bit values (so a max of 2,147,483,647)
 * @export
 * @param {Number} value
 * @return {Number}  
 */
export function numDigits(value) {
  return (Math.log10((value ^ (value >> 31)) - (value >> 31)) | 0) + 1;
}

/**
 * slightly slower
 *
 * @export
 * @param {*} x
 * @return {*}  
 */
export function numDigits2(x) {
  return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1;
}

/**
 * truncate floating point, works for positives as well as negatives
 * @export
 * @param {Number} value
 * @return {Number}  
 */
export function float2Int(value) {
  return value | 0
}


/**
 * round to precision - fastest
 * @param value
 * @param precision
 * @return {number}
 */
 export function round (n, p) {
	p = p || 100
  const d = Math.pow(10, p);
  return Math.round((n + Number.EPSILON) * d) / d;
}


/**
 * Get the number of decimal places
 * fastest method
 * @export
 * @param {number} value
 * @return {number}  
 */
export function precision(value) {
  if (typeof value !== "number") value = parseFloat(value); 
  if (isNaN(value)) return 0;
  if (!isFinite(value)) return 0;
  var e = 1, p = 0;
  while (Math.round(value * e) / e !== value) { e *= 10; p++; }
  return p;
}


/**
 * Get the number of decimal places
 * method is limited to maximum 10 guaranteed decimals
 * close second for speed
 * @export
 * @param {*} n
 * @return {*}  
 */
 export function decimalPlaces(n) {
  function hasFraction(n) {
    return Math.abs(Math.round(n) - n) > 1e-10;
  }

  let count = 0;
  // multiply by increasing powers of 10 until the fractional part is ~ 0
  while (hasFraction(n * (10 ** count)) && isFinite(10 ** count))
    count++;
  return count;
}

/**
 * Get the number of decimal places
 * converting to string and splitting by . is only a solution for up to 7 decimals
 * slowest
 * @param {number} - value
 * @return {number}
 */
export function getPrecision (value) {
  const str = value.toString()
  const eIndex = str.indexOf('e')
  if (eIndex > 0) {
    const precision = +str.slice(eIndex + 1)
    return precision < 0 ? -precision : 0
  } else {
    const dotIndex = str.indexOf('.')
    return dotIndex < 0 ? 0 : str.length - 1 - dotIndex
  }
}

/**
 * log base 10
 * @param value
 * @return {number}
 */
export function log10 (value) {
  return Math.log(value) / Math.log(10)
}

/**
 * Exponential function of 10
 * @param value
 * @return {number}
 */
export function index10 (value) {
  return Math.pow(10, value)
}

export function power (base, exponent) {
  return Math.pow(base, exponent)
}

/**
 * Function to calculate average of
 * an array using efficient method
 * @param {array} arr
 * @param {number} N
 * @return {number}  
 */
function mean(arr, N)
{
    // Store the average of the array
    var avg = 0;
 
    // Traverse the array arr[]
    for(var i = 0; i < N; i++) {
 
        // Update avg
        avg += parseFloat((arr[i] - avg) / (i + 1));
    }
 
    // Return avg
    return avg;
}
