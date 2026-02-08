let currentViewDate = new Date();

export function getMinAllowedDate() {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 90);
  return minDate;
}

export function isDateAllowed(date) {
  const minDate = getMinAllowedDate();
  const today = new Date();
  return date >= minDate && date <= today;
}

export function changeDate(direction) {
  const newDate = new Date(currentViewDate);
  newDate.setDate(newDate.getDate() + direction);

  if (isDateAllowed(newDate)) {
    currentViewDate = newDate;
  }

  return currentViewDate;
}

export function jumpToDate(daysOffset) {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + daysOffset);

  if (isDateAllowed(newDate)) {
    currentViewDate = newDate;
  }

  return currentViewDate;
}

export function getCurrentViewDate() {
  return currentViewDate;
}

export function setCurrentViewDate(date) {
  currentViewDate = date;
}
