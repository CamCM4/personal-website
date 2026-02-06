let events = [];
let editingEventIndex = null;

function startCreateEvent() {
  editingEventIndex = null;

  const form = document.getElementById("event_form");
  form.reset();

  updateLocationOptions();
}

function updateLocationOptions() 
{
  const modality = document.getElementById("event_modality").value;
  const locationGroup = document.getElementById("location_group");
  const remoteUrlGroup = document.getElementById("remote_url_group");
  const attendeesGroup = document.getElementById("attendees_group");

  if (modality === "in-person") 
    {
    locationGroup.style.display = "block";
    attendeesGroup.style.display = "block";
    remoteUrlGroup.style.display = "none";
  } else if (modality === "remote") {
    remoteUrlGroup.style.display = "block";
    attendeesGroup.style.display = "block";
    locationGroup.style.display = "none";
  } else {
    locationGroup.style.display = "none";
    remoteUrlGroup.style.display = "none";
    attendeesGroup.style.display = "none";
  }
}

function saveEvent() {
  const form = document.getElementById("event_form");

  if (!form.checkValidity()) 
    {
    form.reportValidity();
    return;
  }

  const eventDetails = 
  {
    name: document.getElementById("event_name").value,
    category: document.getElementById("event_category").value,
    weekday: document.getElementById("event_weekday").value,
    time: document.getElementById("event_time").value,
    modality: document.getElementById("event_modality").value,
    location: document.getElementById("event_location").value || null,
    remote_url: document.getElementById("event_remote_url").value || null,
    attendees: document.getElementById("event_attendees").value,
  };

  if (editingEventIndex !== null) 
    {
    events[editingEventIndex] = eventDetails;

    refreshCalendarUI();

    editingEventIndex = null;
  } 
  else 
    {
    events.push(eventDetails);
    addEventToCalendarUI(eventDetails);
  }

  form.reset();
  updateLocationOptions();

  const myModalElement = document.getElementById("event_modal");
  const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
  myModal.hide();
}

function addEventToCalendarUI(eventInfo) 
{
  const index = events.indexOf(eventInfo);
  const eventCard = createEventCard(eventInfo, index);
  const dayColumn = document.getElementById(eventInfo.weekday);
  dayColumn.appendChild(eventCard);
}

function createEventCard(eventDetails, index) 
{
  let event_element = document.createElement("div");
  event_element.classList = "event row border rounded m-1 py-1";

  const categoryColors = {
    academic: "bg-primary-subtle",
    work: "bg-success-subtle",
    personal: "bg-warning-subtle",
    fitness: "bg-info-subtle",
  };

  event_element.classList.add(categoryColors[eventDetails.category] || "bg-light");

  let info = document.createElement("div");
  info.innerHTML = `
    <strong>Event Name:</strong> ${eventDetails.name}<br>
    <strong>Event Time: </strong>${eventDetails.time}<br>
    <strong>Event Modality: </strong>${eventDetails.modality}<br>
    ${eventDetails.location ? "<strong>Event Location: </strong>" + eventDetails.location + "<br>" : ""}
    ${eventDetails.remote_url ? "<strong>Remote URL: </strong>" + eventDetails.remote_url + "<br>" : ""}
    <strong>Attendees:</strong> ${eventDetails.attendees}
  `;

  event_element.appendChild(info);

  event_element.style.cursor = "pointer";
  event_element.addEventListener("click", () => openEditModal(index));

  return event_element;
}

function openEditModal(index) 
{
  const event = events[index];
  editingEventIndex = index;

  document.getElementById("event_name").value = event.name;
  document.getElementById("event_category").value = event.category;
  document.getElementById("event_weekday").value = event.weekday;
  document.getElementById("event_time").value = event.time;
  document.getElementById("event_modality").value = event.modality;
  document.getElementById("event_location").value = event.location || "";
  document.getElementById("event_remote_url").value = event.remote_url || "";
  document.getElementById("event_attendees").value = event.attendees;

  updateLocationOptions();

  const myModalElement = document.getElementById("event_modal");
  const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
  myModal.show();
}

function refreshCalendarUI() 
{
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  days.forEach((day) => {
    const dayColumn = document.getElementById(day);
    dayColumn.innerHTML = `<div class="h6 text-center position-relative py-2 day">${day.charAt(0).toUpperCase() + day.slice(1)}</div>`;
  });

  events.forEach((event, index) => 
    {
    const eventCard = createEventCard(event, index);
    const dayColumn = document.getElementById(event.weekday);
    dayColumn.appendChild(eventCard);
  });
}

function startCreateEvent() 
{
  editingEventIndex = null;
  document.getElementById("event_form").reset();
  updateLocationOptions();
}

const eventModal = document.getElementById("event_modal");

eventModal.addEventListener("show.bs.modal", function () 
{
  if (editingEventIndex === null) 
    {
    const form = document.getElementById("event_form");
    form.reset();
    updateLocationOptions();
  }
});