sceditor.plugins.autosave = function () {
    var enabled = false;
    var timer;
    var timerInterval = 650;
    this.signalReady = function () {
        console.log('PLATO: Initializing Plugin - AutoSave')
        if (typeof SaveAllTheThings !== 'undefined') {
            // console.log('Found dependency function. Ready to go!')
            enabled = true;
        } else {
            console.log('PLATO: Error - Unable to find dependency function. Autosave plugin disabled.')
        }
    }
    this.signalKeyupEvent = function (e) {
        if (enabled) {
            clearTimeout(timer);
            this.updateOriginal();
            timer = setTimeout(SaveAllTheThings, timerInterval);
        }
    }
    this.signalKeydownEvent = function (e) {
        if (enabled) {
            clearTimeout(timer);
        }
    }
}