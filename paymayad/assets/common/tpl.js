define(function () {
    return '<table class="ad-info-window ad-info-window-{{ styleID }}">' +
        '<tbody><tr>' +
        '{{#image}}<td><a href="{{ link }}" target="_blank"><img src="{{ image }}"/></a></td>{{/image}}' +
        '{{#description}}<td><a href="{{ link }}" target="_blank">{{ description }}</a></td>{{/description}}' +
        '</tr></tbody></table>';
});