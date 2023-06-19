// Sketchfab Viewer API: Leather Seat Configurator Test
const version = '1.12.1';
var uid = 'e08defaa5f20428f81a61a05886e1034';
var iframe = document.getElementById('api-frame');
var client = new window.Sketchfab(version, iframe);
let api;
let materialToChange;

//////////////////////////////////
// Color Math Code
//////////////////////////////////

const GAMMA = 2.4;

function srgbToLinear1(c) {
    var v = 0.0;
    if (c < 0.04045) {
        if (c >= 0.0) v = c * (1.0 / 12.92);
    } else {
        v = Math.pow((c + 0.055) * (1.0 / 1.055), GAMMA);
    }
    return v;
}

function srgbToLinear(c, out) {
    var col = out || new Array(c.length);

    if (c.length > 2 && c.length < 5) {
        col[0] = srgbToLinear1(c[0]);
        col[1] = srgbToLinear1(c[1]);
        col[2] = srgbToLinear1(c[2]);
        if (col.length > 3 && c.length > 3) col[3] = c[3];
    } else {
        throw new Error('Invalid color. Expected 3 or 4 components, but got ' + c.length);
    }
    return col;
}

function hexToRgb(hexColor) {
    var m = hexColor.match(/^#([0-9a-f]{6})$/i);
    if (m) {
        return [
            parseInt(m[1].substr(0, 2), 16) / 255,
            parseInt(m[1].substr(2, 2), 16) / 255,
            parseInt(m[1].substr(4, 2), 16) / 255
        ];
    } else {
        throw new Error('Invalid color: ' + hexColor);
    }
}

//////////////////////////////////
// End Color Math Code
//////////////////////////////////

function setColor(hexColor) {

    var parsedColor = srgbToLinear(hexToRgb(hexColor));
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = parsedColor;

    api.setMaterial(materialToChange, function() {
        console.log('Color set to ' + hexColor);
    });
}

var error = function() {
    console.error('Sketchfab API error');
};

var success = function(apiClient) {
    api = apiClient;
    api.start();
    api.addEventListener('viewerready', function() {
        console.log('viewer ready');

        document.getElementById('black').addEventListener('click', function() {
            setColor('#000000');
        });
        document.getElementById('white').addEventListener('click', function() {
            setColor('#ffffff');
        });

        api.getMaterialList(function(err, materials) {
            console.log(materials);
            materials.forEach(function(material) {
                if (material.name === "leather") {
                    materialToChange = material;
                }
            });
        });

    });
};

client.init(uid, {
    annotation: 0, // Usage: Setting to [1 – 100] will automatically load that annotation when the viewer starts.
    annotations_visible: 1, // Usage: Setting to 0 will hide annotations by default.
    autospin: 0, // Usage: Setting to any other number will cause the model to automatically spin around the z-axis after loading.
    autostart: 1, // Usage: Setting to 1 will make the model load immediately once the page is ready, rather than waiting for a user to click the Play button.
    cardboard: 0, // Usage: Start the viewer in stereoscopic VR Mode built for Google Cardboard and similar devices.
    camera: 1, // Usage: Setting to 0 will skip the initial animation that occurs when a model is loaded, and immediately show the model in its default position.
    ui_stop: 0, // Usage: Setting to 0 will hide the "Disable Viewer" button in the top right so that users cannot stop the 3D render once it is started.
    transparent: 0, // Usage: Setting to 1 will make the model's background transparent
    ui_animations: 0, // Usage: Setting to 0 will hide the animation menu and timeline.
    ui_annotations: 0, // Usage: Setting to 0 will hide the Annotation menu.
    ui_controls: 1, // Usage: Setting to 0 will hide all the viewer controls at the bottom of the viewer (Help, Settings, Inspector, VR, Fullscreen, Annotations, and Animations).
    ui_fullscreen: 1, // Usage: Setting to 0 will hide the Fullscreen button.
    ui_general_controls: 1, // Usage: Setting to 0 will hide main control buttons in the bottom right of the viewer (Help, Settings, Inspector, VR, Fullscreen).
    ui_help: 1, // Usage: Setting to 0 will hide the Help button.
    ui_hint: 1, // Usage: Setting to 0 will always hide the viewer hint animation ("click & hold to rotate"). Setting to 1 will show the hint the first time per browser session (using a cookie). Setting to 2 will always show the hint.
    ui_infos: 0, // Usage: Setting to 0 will hide the model info bar at the top of the viewer.
    ui_inspector: 0, // Usage: Setting to 0 will hide the inspector button.
    ui_settings: 0, // Usage: Setting to 0 will hide the Settings button.
    ui_vr: 1, // Usage: Setting to 0 will hide the View in VR button.
    ui_watermark_link: 0, // Usage: Setting to 0 remove the link from the Sketchfab logo watermark.
    ui_color: '00a8c0', // Usage: Setting to a hexidecimal color code (without the #) or a HTML color name will change the color of the viewer loading bar.
    ui_watermark: 0, // Usage: Setting to 0 remove the Sketchfab logo watermark.

    success: success,
    error: error
});

//////////////////////////////////
// GUI Code
//////////////////////////////////
function initGui() {
    var controls = document.getElementById('controls');
    var buttonsText = '';
    buttonsText += '<button id="black">Black</button>';
    buttonsText += '<button id="white">White</button>';
    controls.innerHTML = buttonsText;
}
initGui();

//////////////////////////////////
// GUI Code end
//////////////////////////////////
