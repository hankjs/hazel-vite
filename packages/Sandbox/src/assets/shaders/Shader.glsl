#type vertex
#version 300 es
precision highp float;

layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Colot;

uniform mat4 u_ViewProjection;
uniform mat4 u_Transform;

out vec3 v_Position;
out vec4 v_Color;

void main()
{
    v_Position = a_Position;
    v_Color = a_Colot;
    gl_Position = u_ViewProjection * u_Transform * vec4(a_Position, 1.0);	
}

#type fragment
#version 300 es
precision highp float;

out vec4 color;

in vec3 v_Position;
in vec4 v_Color;

void main()
{
    color = vec4(v_Position * 0.5 + 0.5, 1.0);
    color = v_Color;
}