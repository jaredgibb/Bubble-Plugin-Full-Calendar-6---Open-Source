function(instance, properties, context) {


 	const date = properties.date.toISOString()
    instance.data.calendar.gotoDate(date)

}