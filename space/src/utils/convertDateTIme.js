export function timeAgo(utcDateTime) {
    // Convert the UTC timestamp to a JavaScript Date object
    var dateInUTC = new Date(utcDateTime);

    // Calculate the time difference in milliseconds
    var timeDifference = (new Date() - dateInUTC);

    // Convert the time difference to seconds
    var seconds = Math.floor(timeDifference / 1000);

    // Define time intervals in seconds
    var intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        min: 60,
        sec: 1
    };

    // Initialize variables to store the human-readable time and unit
    var time;
    var unit;

    // Iterate through intervals to find the largest one that fits the time difference
    for (var key in intervals) {
        if (seconds >= intervals[key]) {
            time = Math.floor(seconds / intervals[key]);
            unit = key;

            // If it's more than a week ago, return the formatted date
            if (unit === 'week' && time > 1) {
                return convertDateTime(utcDateTime);
            }

            // Return the formatted time ago string
            return `${time} ${unit}${time > 1 ? 's' : ''} ago`;
        }
    }

    // If the time difference is less than a second, return 'just now'
    return 'just now';
}



export function convertDateTime(utcDateTime, userLocale) {
    // Convert the UTC timestamp to a JavaScript Date object
    var dateInUTC = new Date(utcDateTime);

    // Format the date for display with the user's locale
    var options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        //second: '2-digit',
        //timeZoneName: 'short'
    };

    // Use the user's locale to ensure consistent formatting
    var formattedDate = " on " + dateInUTC.toLocaleString(userLocale, options);

    // Return the local date with the time zone abbreviation to the user
    return formattedDate;
}
