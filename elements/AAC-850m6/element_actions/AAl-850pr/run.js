function(instance, properties, context) {
    
  	instance.data.global_event_color = properties.global_event_color
    instance.data.darkTextColor = properties.darkTextColor
    instance.data.lightTextColor = properties.lightTextColor

instance.canvas.append('<div id="calendar"></div>')
  var calendarEl = document.getElementById('calendar');
	const header = {
            start: properties.header_left,
            center: properties.header_center,
            end: properties.header_right // will normally be on the right. if RTL, will be on the left
        }
    const headerObject = (properties.show_header) ? header : false

    instance.data.calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: properties.initial_view,
      height: "auto",
      headerToolbar: headerObject,
      fixedWeekCount: false,
      selectMinDistance:10,
      dayMaxEventRows: properties.max_event_rows,
      eventMaxStack: properties.max_stacked_events,
      eventBackgroundColor: properties.global_event_color,
      eventBorderColor: properties.event_border_color,
      eventDisplay: properties.eventDisplay,
      displayEventTime: properties.displayEventTime,
      select: function(selectionInfo) {
        const selectedTimeframe = {
          "_p_startTime": selectionInfo.startStr,
          "_p_endTime": selectionInfo.endStr
        }

        instance.publishState('selected_timeframe', selectedTimeframe)
        instance.triggerEvent('timeframeselected')
      },
      dateClick: function(info) {
        const selectedTimeframe = {
          "_p_startTime": info.dateStr
        }

        instance.publishState('selected_timeframe', selectedTimeframe)
        instance.triggerEvent('a_date_has_been_clicked')

      },
      viewDidMount: function(args) {
        instance.publishState('current_calendar_date', instance.data.calendar.getDate().toISOString())

      }
    });

    instance.data.calendar.render();

    //add an event listner to full calendar buttons 
    var elements = document.getElementsByClassName("fc-button");

    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function() {
        instance.publishState('current_calendar_date', instance.data.calendar.getDate().toISOString())
      }, false);
    }
    
    instance.data.initialized = true
	


}