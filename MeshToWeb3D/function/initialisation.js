//Author: Zach.X.G.Zheng
//Date: 9 April 2022
//Info: zach@zachitect.com
//Display a 3d model on webpage
//Preparing Environment

//Initilisation ----------
function init()
{
    //Create Perspective Camera ----------
    camera = new THREE.PerspectiveCamera
    (
        pers_cam_fov,
        (window.innerWidth * z_window_ratio) / (window.innerHeight * z_window_ratio),
        cam_near,
        cam_far,
    );
    camera.zoom = cam_zoom;
    camera.position.set(cam_pos_x, cam_pos_y, cam_pos_z);
    camera.updateProjectionMatrix()

    //Ambient Light
    light = new THREE.AmbientLight(z_amb_light_colour); // soft white light

    //Create Light
    spotLight = new THREE.DirectionalLight(z_spot_light_colour, z_spot_light_intensity);
    spotLight.position.set(camera.position.x,camera.position.y,camera.position.z)
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = z_spot_light_shadow_map;
    spotLight.shadow.mapSize.height = z_spot_light_shadow_map;
    spotLight.shadow.camera.near = z_spot_light_shadow_dist;
    spotLight.shadow.camera.far = z_spot_light_shadow_dist;
    spotLight.shadow.camera.left = -z_spot_light_shadow_dist;
    spotLight.shadow.camera.right = z_spot_light_shadow_dist;
    spotLight.shadow.camera.top = z_spot_light_shadow_dist;
    spotLight.shadow.camera.bottom = -z_spot_light_shadow_dist;

    //Create scene
    scene = new THREE.Scene();
    scene.add(camera) 
    if(z_scene_colour_visible)
    {
        scene.background = new THREE.Color(z_scene_bg_colour) //Scene BG
    }
    scene.add(camera);
    if(z_grid_visible)
    {
        scene.add(new THREE.GridHelper(z_grid_size, z_grid_div, z_colour_cl, z_colour_grid));
    }
    if(z_amb_light_visible)
    {
        scene.add( light );
    }
    if(z_spot_light_visible)
    {
        scene.add( spotLight );
    }

    //Create Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true,  alpha: true, powerPreference: "high-performance", logarithmicDepthBuffer: false });
    renderer.setClearColor(new THREE.Color(z_renderer_bg_colour), z_renderer_bg_alpha);
    renderer.setSize(window.innerWidth * z_window_ratio, window.innerHeight * z_window_ratio);
    renderer.shadowMap.enabled = z_renderer_shadow_visible;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //Append Renderer to Webpage ----------
    document.body.appendChild(renderer.domElement);

    //Create Controls
    controls = new THREE.OrbitControls( camera, renderer.domElement);
    controls.autoRotate = z_controls_auto_rotate;
    controls.autoRotateSpeed = z_controls_auto_rotate_speed;
    controls.enableDamping = z_controls_damping_enable;
    controls.dampingFactor = z_controls_damping_factor;
    controls.keyPanSpeed = z_controls_key_pan_speed;
    controls.maxAzimuthAngle = z_controls_max_azimuth_angle;
    controls.minAzimuthAngle = z_controls_min_azimuth_angle;
    controls.maxPolarAngle = z_controls_max_polar_angle;
    controls.minPolarAngle = z_controls_min_polar_angle;
    controls.maxDistance = z_controls_max_distance;
    controls.minDistance = z_controls_min_distance;
    controls.target = z_controls_target;
    controls.update();
}