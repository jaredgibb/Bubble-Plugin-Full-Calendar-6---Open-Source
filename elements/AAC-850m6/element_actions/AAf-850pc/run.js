function(instance, properties, context) {


instance.data.calendar.next()
 instance.publishState('current_calendar_date', instance.data.calendar.getDate().toISOString())


}