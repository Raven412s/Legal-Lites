"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateSelectArg, formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface EventData {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [eventStart, setEventStart] = useState<string>("");
  const [eventEnd, setEventEnd] = useState<string>("");
  const [eventColor, setEventColor] = useState<string>("#3788d8");
  const [eventTextColor, setEventTextColor] = useState<string>("#000000");
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [eventDescription, setEventDescription] = useState<string>("");

  const handleEditorChange = (content: string) => {
    setEventDescription(content); // Set the rich text content
  };

  const backgroundColorOptions = ["#6293ff", "#dc2626", "#2ca874", "#dbe0e5", "#e58a00", "#c8d9ff", "#f5bebe", "#c0e5d9", "#f8f9fa", "#f7dcb3",];
  const textColorOptions = ["#131920", "#f5bebe", "#c035d9", "#f8f9fa", "#f7dcb3", "#c8d9ff", "#6293ff", "#dc2626", "#2ca87f", "#dbe0e5", "#e58a00" ];

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setCurrentEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever currentEvents changes
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(currentEvents));
  }, [currentEvents]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setEventStart(selected.startStr);
    setEventEnd(selected.endStr || selected.startStr);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    // Reset the form fields when closing the dialog
    setIsDialogOpen(false);
    setNewEventTitle("");
    setEventStart("");
    setEventEnd("");
    setEventColor("#3788d8");
    setEventTextColor("#000000");
    setSelectedEvent(null);
    setEventDescription("");
    setIsAllDay(false);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const newEvent: EventData = {
        id: `${eventStart}-${newEventTitle}`,
        title: newEventTitle,
        description: eventDescription,
        start: eventStart,
        end: eventEnd || eventStart,
        allDay: isAllDay,
        backgroundColor: eventColor,
        borderColor: eventColor,
        textColor: eventTextColor,
      };

      // Update the existing event if selectedEvent is set, otherwise add a new event
      if (selectedEvent) {
        setCurrentEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id ? { ...event, ...newEvent } : event
          )
        );
      } else {
        setCurrentEvents((prevEvents) => [...prevEvents, newEvent]);
      }

      handleCloseDialog();
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    // Filter out the deleted event
    setCurrentEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  };

  const handleEditEvent = (event: EventData) => {
    // Populate the dialog with the event data to edit
    setSelectedEvent(event);
    setNewEventTitle(event.title);
    setEventStart(event.start);
    setEventEnd(event.end || event.start);
    setEventColor(event.backgroundColor || "#3788d8");
    setEventTextColor(event.textColor || "#000000");
    setEventDescription(event.description || "");
    setIsAllDay(event.allDay);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex w-full px-10 pb-5 justify-between items-start gap-8">
        <div className="w-3/12">
          <div className="py-10 text-2xl font-extrabold px-7">Calendar Events</div>
          <ul className="space-y-6">
            {currentEvents.length <= 0 && (
              <div className="italic text-center glassmorphism">No Events Present</div>
            )}

            {currentEvents.length > 0 &&
              currentEvents.map((event) => (
                <li
                  className="border card-shadow w-full px-4 pt-5 pb-2 rounded-lg !glassmorphism"
                  key={event.id}
                >
                  <div className="flex flex-col gap-5 items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                      {/* Render the rich text description */}
                      {event.description && (
                        <div
                          className="text-sm text-muted-foreground mb-2"
                            >
                            {event.description}
                        </div>
                      )}
                      <Badge>
                        <label className="text-xs">
                          {formatDate(new Date(event.start), {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                          {event.end && event.start !== event.end && (
                            <>{` - ${formatDate(new Date(event.end), {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}`}</>
                          )}
                        </label>
                      </Badge>
                    </div>
                    <div className="flex justify-end w-full space-x-2">
                      <Button
                        variant={"ghost"}
                        className="p-2 rounded-md hover:bg-gray-100"
                        onClick={() => handleEditEvent(event)}
                      >
                        <FaEdit className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteEvent(event.id)}
                        variant={"ghost"}
                        className="p-2 rounded-md hover:bg-gray-100"
                      >
                        <FaTrash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="w-[850px] mt-8">
          <div className="rounded-lg p-5 card-shadow overflow-hidden">
            <FullCalendar
              height={"85vh"}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              events={currentEvents}
            />
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="min-w-[60vw] overflow-scroll h-[90%]">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? "Edit" : "Add"} Event Details</DialogTitle>
          </DialogHeader>
          <form className="space-y-6 p-6 rounded-lg card-shadow w-full mx-auto" onSubmit={handleAddEvent}>
            <div className="flex flex-col">
              <label htmlFor="eventTitle" className="mb-1 text-sm">Title</label>
              <input
                id="eventTitle"
                type="text"
                placeholder="Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="eventStart" className="mb-1 text-sm">Start Date</label>
              <input
                id="eventStart"
                type="datetime-local"
                value={eventStart}
                onChange={(e) => setEventStart(e.target.value)}
                required
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="eventEnd" className="mb-1 text-sm">End Date</label>
              <input
                id="eventEnd"
                type="datetime-local"
                value={eventEnd}
                onChange={(e) => setEventEnd(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="eventDescription" className="mb-1 text-sm">Description</label>
            <textarea name="eventDescription" id="eventDescription" rows={5} placeholder="describe your event" className="border border-gray-300 p-2 rounded-md" value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required></textarea>

            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="eventColor" className="mb-1 text-sm">Background Color</label>
                <div className="flex gap-2">
                  {backgroundColorOptions.map((color) => (
                    <div
                      key={color}
                      style={{ backgroundColor: color }}
                      className={`w-8 h-8 rounded cursor-pointer border-2 ${
                        color === eventColor ? "ring-2 ring-offset-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setEventColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="eventTextColor" className="mb-1 text-sm">Text Color</label>
                <div className="flex gap-2">
                  {textColorOptions.map((color) => (
                    <div
                      key={color}
                      style={{ backgroundColor: color }}
                      className={`w-8 h-8 rounded cursor-pointer border-2 ${
                        color === eventTextColor ? "ring-2 ring-offset-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setEventTextColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="isAllDay"
                type="checkbox"
                checked={isAllDay}
                onChange={() => setIsAllDay(!isAllDay)}
                className="mr-2"
              />
              <label htmlFor="isAllDay" className="text-sm">All Day Event</label>
            </div>

            <Button type="submit" className="w-full">
              {selectedEvent ? "Update Event" : "Add Event"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
