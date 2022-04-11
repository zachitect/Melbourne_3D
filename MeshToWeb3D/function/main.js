//Author: Zach.X.G.Zheng
//Date: 9 April 2022
//Info: zach@zachitect.com
//Display a 3d model on webpage
//Camera Light Action

// ---------- Declare variables ----------
var scene; var renderer; var camera; var control; var spotlight; var controls;

// ---------- Misc parameters ----------
var z_window_ratio = 1; //Set ratio b/w renderer and window

//Environment colours
var z_scene_colour_visible = false
var z_scene_bg_colour = 0xf2f5f7; //This will overwrite renderer bg

//Grid settings
var z_grid_visible = false;
var z_grid_size = 200;
var z_grid_div = 20;
var z_colour_cl = 0xff002b;
var z_colour_grid = 0xff002b;

// ---------- Camera settings  ----------
var pers_cam_fov = 30;
var cam_near = 100;
var cam_far = 2000;
var cam_zoom = 1;
var cam_pos_x = 0;
var cam_pos_y = 100;
var cam_pos_z = 300;

// ---------- Renderer settings ----------
var z_renderer_bg_colour = 0xf2f5f7; //This can set alpha
var z_renderer_bg_alpha = 1;
var z_renderer_shadow_visible = true;


// ---------- Light settings ----------
var z_amb_light_visible = true;
var z_amb_light_colour = 0x444444;

var z_spot_light_visible = true;
var z_spot_light_colour = 0xffffff;
var z_spot_light_intensity = 1;
var z_spot_light_shadow_map = 4096;
var z_spot_light_shadow_dist = 300;


// ---------- Control settings ----------
var z_controls_auto_rotate = true;
var z_controls_auto_rotate_speed = 0.6; //2 = 30s/360deg @60fps
var z_controls_damping_enable = true; //sense of weight
var z_controls_damping_factor = 0.5;
var z_controls_key_pan_speed = 2; //7.0 pixel per keypress
var z_controls_max_azimuth_angle;
var z_controls_min_azimuth_angle;
var z_controls_max_polar_angle = 3.1415925;
var z_controls_min_polar_angle = -3.1415925;
var z_controls_max_distance = cam_far / 2;
var z_controls_min_distance = cam_near / 2;
var z_controls_target = new THREE.Vector3(0,0,0);

// ---------- Initialise Environment ----------
init();

// ---------- Add Rhino Object to ThreeJs ----------
var jsdata = JSON.parse(data);
console.warn();
var ImportedMesh = []
for(i=0; i < jsdata["mesh_export"].length; i++)
{
    var subdata = jsdata["mesh_export"][i]
    var geometry = new THREE.BufferGeometry();
    var positions = Float32Array.from(subdata["vertex"]);
    var normals = Float32Array.from(subdata["normal"]);
    var colours = Uint8Array.from(subdata["colour"]);

    geometry.setAttribute('position',
        new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal',
        new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute('color',
        new THREE.BufferAttribute(colours, 3));
    
    geometry.attributes.color.normalized = true;
    geometry.setIndex(subdata["index"])

    var material  = new THREE.MeshStandardMaterial({ vertexColors: true});
    var geometry_object = new THREE.Mesh(geometry, material);
    geometry_object.position.set(0,-12,0);
    geometry_object.receiveShadow = true;
    geometry_object.castShadow = true;
    scene.add(geometry_object);
}

// ---------- Control Adjustment ----------

//Window Resize Event ----------
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize()
{
    camera.aspect = window.innerWidth * z_window_ratio/ (window.innerHeight * z_window_ratio);
    renderer.setSize( window.innerWidth * z_window_ratio, window.innerHeight * z_window_ratio);
    camera.updateProjectionMatrix();
}

function animate()
{
    spotLight.position.set(camera.position.x,camera.position.y,camera.position.z)
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function resetscene()
{
    camera.position.x = cam_pos_x;
    camera.position.y = cam_pos_y;
    camera.position.z = cam_pos_z;
    OrbitCtrl.reset();
}