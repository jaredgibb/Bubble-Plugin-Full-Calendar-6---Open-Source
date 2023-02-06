function(instance, properties, context) {
    
    
    
    
    
    
    instance.data.update = () => {
        //set calendar height
        instance.data.calendar.setOption('height', properties.bubble.height());

        //header settings
        const header = {
            start: properties.header_left,
            center: properties.header_center,
            end: properties.header_right // will normally be on the right. if RTL, will be on the left
        }
        const headerObject = (properties.show_header) ? header : false
        instance.data.calendar.setOption('headerToolbar', headerObject)

        //title formatting
        const titleFormatObject = {
            month: 'long',
            year: 'numeric',
        }


        instance.data.calendar.setOption('titleFormat', titleFormatObject)


        //Date Clicking & Selecting

        //set minimum distance a users mouse must travel before a seelction is made
        instance.data.calendar.setOption('selectMinDistance', properties.selectmindistance)

        //allow section of dates
        instance.data.calendar.setOption('selectable', properties.selectable)

        //Whether to draw a “placeholder” event while the user is dragging.
        instance.data.calendar.setOption('selectMirror', properties.selectmirror)

        //Determines whether the user is allowed to select periods of time that are occupied by events.
        instance.data.calendar.setOption('selectOverlap', properties.selectoverlap)

        //Limits user selection to certain windows of time.
        const defaultBizHours = {
            // days of week. an array of zero-based day of week integers (0=Sunday)
            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
            startTime: '09:00', // a start time (10am in this example)
            endTime: '17:00', // an end time (6pm in this example)
        }

        //custom time selection constraints
        const userConstraintHours = {
            daysOfWeek: properties.customconstraintdaysofweek.get(0, properties.customconstraintdaysofweek.length()),
            startTime: properties.customconstraintstarttime,
            endTime: properties.customconstraintendtime
        }

        //if they have chosen to enforce to event time select constraints they then will choose between default biz hours or their user constraint hours
        //if they choose business hours, this will override these settings. they really shouldnt try to use both at the same time
        if (properties.selectconstraint) {
            instance.data.calendar.setOption('businessHours', properties.usedefaultbusinesshours ? defaultBizHours : userConstraintHours)
            instance.data.calendar.setOption('selectConstraint', properties.usedefaultbusinesshours ? defaultBizHours : userConstraintHours)
        }
        



        const events = []
        const startList = properties.startTimes.split('##')
        const endList = properties.endTimes.split('##')
        const titleList = properties.eventTitles.split('##')
        const IDList = properties.eventIDs.split('##')
        const resourceIDsList = (properties.resourceIDs) ? properties.resourceIDs.split('##') : []
        const backgroundColorsList = (properties.backgroundColors) ? properties.backgroundColors.split('##') : []
        //event array should be based on the length of the startTime list as this is the minimum requirement to get on the calendar
        //event array lists will need to be delimited with a doubleHash. sorry

        for (let i = 0; i < startList.length; i++) {
            
            //get event bg color
            const bgColor = (backgroundColorsList[i]) ? backgroundColorsList[i] : instance.data.global_event_color
            const lightTextColor = instance.data.lightTextColor
            const darkTextColor = instance.data.darkTextColor
            
            
            //check if event has a resource
            const resourceID = (resourceIDsList[i]) ? resourceIDsList[i] : 'No Resource'
            
            
            //create event object
            const event = {
                title: titleList[i],
                start: startList[i],
                end: endList[i],
                id: IDList[i],
                backgroundColor: bgColor,
				textColor: instance.data.decideEventTextColor(bgColor, lightTextColor, darkTextColor),
                resourceId: resourceID
            }
           
            //add event to events array
            events.push(event)
        }

        //grab and remove any event sources
        const removeEvents = instance.data.calendar.getEventSources();
        removeEvents.forEach(event => {
            event.remove();
        });

        //add a new event source
        instance.data.calendar.addEventSource(events)




        //end of update function   
    }


    function checkForCalendar() {
        if (instance.data.calendar) {
            instance.data.update()
        } else {
            //wait 50ms and check again
            setTimeout(checkForCalendar, 500)
        }
    }
        //only run update after the calendar has been initialized

    checkForCalendar()


}