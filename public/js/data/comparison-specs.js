export const SPEC_FIELDS = {
  "surface-top-hammer": [
    { key: "holeRangeMin",      label: "Min Hole Diameter",  unit: "mm",     type: "numeric", higherIsBetter: false },
    { key: "holeRangeMax",      label: "Max Hole Diameter",  unit: "mm",     type: "numeric", higherIsBetter: true },
    { key: "rockDrillPowerMax", label: "Rock Drill Power",   unit: "kW",     type: "numeric", higherIsBetter: true },
    { key: "airCapacity",       label: "Air Capacity",       unit: "m\u00B3/min", type: "numeric", higherIsBetter: true },
    { key: "airPressure",       label: "Air Pressure",       unit: "bar",    type: "numeric", higherIsBetter: true },
    { key: "weight",            label: "Operating Weight",   unit: "kg",     type: "numeric", higherIsBetter: false },
    { key: "enginePower",       label: "Engine Power",       unit: "kW",     type: "numeric", higherIsBetter: true },
    { key: "fuelConsumption",   label: "Fuel Consumption",   unit: "L/h",    type: "numeric", higherIsBetter: false },
    { key: "tramSpeed",         label: "Tram Speed",         unit: "km/h",   type: "numeric", higherIsBetter: true },
    { key: "noiseLevel",        label: "Noise Level",        unit: "dB(A)",  type: "numeric", higherIsBetter: false },
    { key: "automationLevel",   label: "Automation",         unit: "",       type: "text",    higherIsBetter: null },
    { key: "dustCollection",    label: "Dust Collection",    unit: "",       type: "boolean", higherIsBetter: true },
  ],
  "surface-dth": [
    { key: "holeRangeMin",      label: "Min Hole Diameter",  unit: "mm",     type: "numeric", higherIsBetter: false },
    { key: "holeRangeMax",      label: "Max Hole Diameter",  unit: "mm",     type: "numeric", higherIsBetter: true },
    { key: "airCapacity",       label: "Air Capacity",       unit: "m\u00B3/min", type: "numeric", higherIsBetter: true },
    { key: "airPressure",       label: "Air Pressure",       unit: "bar",    type: "numeric", higherIsBetter: true },
    { key: "bitDiameterMax",    label: "Max Bit Diameter",   unit: "mm",     type: "numeric", higherIsBetter: true },
    { key: "weight",            label: "Operating Weight",   unit: "kg",     type: "numeric", higherIsBetter: false },
    { key: "enginePower",       label: "Engine Power",       unit: "kW",     type: "numeric", higherIsBetter: true },
    { key: "fuelConsumption",   label: "Fuel Consumption",   unit: "L/h",    type: "numeric", higherIsBetter: false },
    { key: "tramSpeed",         label: "Tram Speed",         unit: "km/h",   type: "numeric", higherIsBetter: true },
    { key: "noiseLevel",        label: "Noise Level",        unit: "dB(A)",  type: "numeric", higherIsBetter: false },
    { key: "automationLevel",   label: "Automation",         unit: "",       type: "text",    higherIsBetter: null },
    { key: "dustCollection",    label: "Dust Collection",    unit: "",       type: "boolean", higherIsBetter: true },
  ],
  "dimensional-stone": [
    { key: "holeRangeMin",      label: "Min Hole Diameter",  unit: "mm",     type: "numeric", higherIsBetter: false },
    { key: "holeRangeMax",      label: "Max Hole Diameter",  unit: "mm",     type: "numeric", higherIsBetter: true },
    { key: "rockDrillPowerMax", label: "Rock Drill Power",   unit: "kW",     type: "numeric", higherIsBetter: true },
    { key: "airCapacity",       label: "Air Capacity",       unit: "m\u00B3/min", type: "numeric", higherIsBetter: true },
    { key: "weight",            label: "Operating Weight",   unit: "kg",     type: "numeric", higherIsBetter: false },
    { key: "enginePower",       label: "Engine Power",       unit: "kW",     type: "numeric", higherIsBetter: true },
    { key: "fuelConsumption",   label: "Fuel Consumption",   unit: "L/h",    type: "numeric", higherIsBetter: false },
    { key: "noiseLevel",        label: "Noise Level",        unit: "dB(A)",  type: "numeric", higherIsBetter: false },
    { key: "holeSpacing",       label: "Hole Spacing",       unit: "mm",     type: "numeric", higherIsBetter: null },
    { key: "dustCollection",    label: "Dust Collection",    unit: "",       type: "boolean", higherIsBetter: true },
  ],
  "rotary-blasthole": [
    { key: "holeRangeMin",        label: "Min Hole Diameter",    unit: "mm",     type: "numeric", higherIsBetter: false },
    { key: "holeRangeMax",        label: "Max Hole Diameter",    unit: "mm",     type: "numeric", higherIsBetter: true },
    { key: "pulldownForce",       label: "Pulldown Force",       unit: "kN",     type: "numeric", higherIsBetter: true },
    { key: "rotaryTorque",        label: "Rotary Torque",        unit: "kNm",    type: "numeric", higherIsBetter: true },
    { key: "compressorCapacity",  label: "Compressor Capacity",  unit: "m\u00B3/min", type: "numeric", higherIsBetter: true },
    { key: "mastHeight",          label: "Mast Height",          unit: "m",      type: "numeric", higherIsBetter: true },
    { key: "weight",              label: "Operating Weight",     unit: "kg",     type: "numeric", higherIsBetter: false },
    { key: "enginePower",         label: "Engine Power",         unit: "kW",     type: "numeric", higherIsBetter: true },
    { key: "fuelConsumption",     label: "Fuel Consumption",     unit: "L/h",    type: "numeric", higherIsBetter: false },
    { key: "tramSpeed",           label: "Tram Speed",           unit: "km/h",   type: "numeric", higherIsBetter: true },
    { key: "noiseLevel",          label: "Noise Level",          unit: "dB(A)",  type: "numeric", higherIsBetter: false },
    { key: "automationLevel",     label: "Automation",           unit: "",       type: "text",    higherIsBetter: null },
    { key: "dustCollection",      label: "Dust Collection",      unit: "",       type: "boolean", higherIsBetter: true },
  ],
};

// Key specs to show in bar charts (most important numeric specs per category)
export const BAR_CHART_SPECS = {
  "surface-top-hammer": ["holeRangeMax", "rockDrillPowerMax", "airCapacity", "enginePower", "weight"],
  "surface-dth": ["holeRangeMax", "airCapacity", "airPressure", "enginePower", "weight"],
  "dimensional-stone": ["holeRangeMax", "rockDrillPowerMax", "airCapacity", "enginePower", "weight"],
  "rotary-blasthole": ["holeRangeMax", "pulldownForce", "compressorCapacity", "enginePower", "weight"],
};

// Key specs to show on catalog cards
export const CARD_SPECS = {
  "surface-top-hammer": [
    { key: "holeRangeMin", key2: "holeRangeMax", label: "Hole Diameter", unit: "mm", isRange: true },
    { key: "rockDrillPowerMax", label: "Rock Drill", unit: "kW" },
    { key: "airCapacity", label: "Air Capacity", unit: "m\u00B3/min" },
  ],
  "surface-dth": [
    { key: "holeRangeMin", key2: "holeRangeMax", label: "Hole Diameter", unit: "mm", isRange: true },
    { key: "airCapacity", label: "Air Capacity", unit: "m\u00B3/min" },
    { key: "airPressure", label: "Air Pressure", unit: "bar" },
  ],
  "dimensional-stone": [
    { key: "holeRangeMin", key2: "holeRangeMax", label: "Hole Diameter", unit: "mm", isRange: true },
    { key: "rockDrillPowerMax", label: "Rock Drill", unit: "kW" },
    { key: "airCapacity", label: "Air Capacity", unit: "m\u00B3/min" },
  ],
  "rotary-blasthole": [
    { key: "holeRangeMin", key2: "holeRangeMax", label: "Hole Diameter", unit: "mm", isRange: true },
    { key: "pulldownForce", label: "Pulldown", unit: "kN" },
    { key: "enginePower", label: "Engine", unit: "kW" },
  ],
};
