import {HAPTIC_SWITCH_ID} from '../../game/vibrate'
import './HapticSwitch.scss'

/** Interruptor invisible cuyo tic háptico usa iOS como vibración (ver game/vibrate.ts). */
function HapticSwitch() {
    return (
        <div className="haptic-switch" aria-hidden="true">
            <input type="checkbox" id={HAPTIC_SWITCH_ID} tabIndex={-1} {...{switch: ''}} />
            <label htmlFor={HAPTIC_SWITCH_ID} />
        </div>
    )
}

export default HapticSwitch
