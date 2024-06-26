/* exported newDeletePollForm updatePollAcceptingAnswers updatePollVisible updateDropdownStates importPolls toggleTimerInputs togglePollFormOptions validateCustomResponse addCustomResponse removeCustomResponse toggle_section get_new_chart_width disableNoResponse clearResponses */
/* global csrfToken displaySuccessMessage displayErrorMessage */

$(document).ready(() => {
    $('.dropdown-bar').on('click', function () {
        $(this).siblings('table').toggle();
        $(this).find('i').toggleClass('down');
    });
});

function newDeletePollForm(pollid, pollname, base_url) {
    if (confirm(`This will delete poll '${pollname}'. Are you sure?`)) {
        const url = `${base_url}/deletePoll`;
        const fd = new FormData();
        fd.append('csrf_token', csrfToken);
        fd.append('poll_id', pollid);
        $.ajax({
            url: url,
            type: 'POST',
            data: fd,
            processData: false,
            cache: false,
            contentType: false,
            success: function (data) {
                try {
                    const msg = JSON.parse(data);
                    if (msg.status !== 'success') {
                        console.error(msg);
                        window.alert('Something went wrong. Please try again.');
                    }
                    else {
                        window.location.reload();
                    }
                }
                catch (err) {
                    console.error(err);
                    window.alert('Something went wrong. Please try again.');
                }
            },
            error: function (err) {
                console.error(err);
                window.alert('Something went wrong. Please try again.');
            },
        });
    }
}

function updatePollAcceptingAnswers(pollid, base_url) {
    const accepting_answers_checkbox = `#poll_${pollid}_view_results`;
    const visible_checkbox = `#poll_${pollid}_visible`;
    let url = base_url;
    const fd = new FormData();
    fd.append('csrf_token', csrfToken);
    fd.append('poll_id', pollid);
    if ($(accepting_answers_checkbox).is(':checked')) {
        $(visible_checkbox).prop('checked', true);
        url += '/setOpen';
    }
    else {
        url += '/setEnded';
    }
    $.ajax({
        url: url,
        type: 'POST',
        data: fd,
        processData: false,
        cache: false,
        contentType: false,
        error: function (err) {
            console.error(err);
            window.alert('Something went wrong. Please try again.');
        },
    });
}

function updatePollVisible(pollid, base_url) {
    const visible_checkbox = `#poll_${pollid}_visible`;
    const accepting_answers_checkbox = `#poll_${pollid}_view_results`;
    let url = base_url;
    const fd = new FormData();
    fd.append('csrf_token', csrfToken);
    fd.append('poll_id', pollid);
    if (!$(visible_checkbox).is(':checked')) {
        $(accepting_answers_checkbox).prop('checked', false);
        url += '/setClosed';
    }
    else {
        url += '/setEnded';
    }
    $.ajax({
        url: url,
        type: 'POST',
        data: fd,
        processData: false,
        cache: false,
        contentType: false,
        error: function (err) {
            console.error(err);
            window.alert('Something went wrong. Please try again.');
        },
    });
}

function updateDropdownStates(curr_state, cookie_key) {
    const expiration_date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7);
    Cookies.set(cookie_key, !curr_state, { expires: expiration_date, path: '/' });
}

function togglePollFormOptions() {
    const correct_options = $('.correct-box');

    correct_options.each(function() {
        $(this).prop('checked', $('#toggle-all').prop('checked'));
    });
}

function validateCustomResponse() {
    const custom_response = document.querySelector('.custom_poll_response');
    const custom_response_submit = document.querySelector('.custom-response-submit');

    const validate = () => {
        if (custom_response.value.trim() !== '') {
            custom_response_submit.disabled = false;
        }
        else {
            custom_response_submit.disabled = true;
        }
    };

    custom_response.addEventListener('input', () => {
        validate();
    });

    validate();
}

function addCustomResponse(pollid, base_url) {
    const custom_response_text = document.querySelector('.custom_poll_response').value;
    const url = `${base_url}/addCustomResponse`;
    const fd = new FormData();
    fd.append('csrf_token', csrfToken);
    fd.append('poll_id', pollid);
    fd.append('custom_response', custom_response_text);
    $.ajax({
        url: url,
        type: 'POST',
        data: fd,
        processData: false,
        cache: false,
        contentType: false,
        error: function(err) {
            console.error(err);
            window.alert('Something went wrong. Please try again.');
        },
        success: function(data) {
            try {
                const msg = JSON.parse(data);
                if (msg.status !== 'success') {
                    displayErrorMessage(msg.message);
                }
                else {
                    window.location.reload();
                }
            }
            catch (err) {
                console.error(err);
                window.alert('Something went wrong. Please try again.');
            }
        },
    });
}

function removeCustomResponse(pollid, optionid, base_url) {
    const url = `${base_url}/removeCustomResponse`;
    const fd = new FormData();
    fd.append('csrf_token', csrfToken);
    fd.append('poll_id', pollid);
    fd.append('option_id', optionid);
    $.ajax({
        url: url,
        type: 'POST',
        data: fd,
        processData: false,
        cache: false,
        contentType: false,
        error: function(err) {
            console.error(err);
            window.alert('Something went wrong. Please try again.');
        },
        success: function(data) {
            try {
                const msg = JSON.parse(data);
                if (msg.status !== 'success') {
                    displayErrorMessage(msg.message);
                }
                else {
                    document.getElementById(`option-row-${optionid}`).remove();
                    displaySuccessMessage(msg.data.message);
                }
            }
            catch (err) {
                console.error(err);
                window.alert('Something went wrong. Please try again.');
            }
        },
    });
}

function importPolls() {
    $('#import-polls-form').submit();
}

function toggleTimerInputs() {
    if ($('#enable-timer').prop('checked')) {
        $('#timer-inputs').show();
    }
    else {
        $('#timer-inputs').hide();
    }
}

function toggle_section(section_id) {
    $(`#${section_id}`).toggle('fast');
}

function get_new_chart_width() {
    const MIN_CHART_WIDTH = 400;
    const DESIRED_CHART_FACTOR = 0.75;
    const table_size = $('#info-histogram-table').width();
    const desired_size = table_size * DESIRED_CHART_FACTOR;
    // if the width of the viewport is small enough
    if (desired_size < MIN_CHART_WIDTH) {
        // set the width of poll-info to 100%
        $('#poll-info').css('max-width', '100%');
        return Math.max(MIN_CHART_WIDTH, table_size);
    }
    // reset width of poll-info
    $('#poll-info').css('max-width', '');
    return desired_size;
}

function disableNoResponse() {
    $('.no-response-radio').prop('checked', false);
}

function clearResponses() {
    if ($('.no-response-radio').is(':checked')) {
        $('.response-radio').prop('checked', false);
    }
}
