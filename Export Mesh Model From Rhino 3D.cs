using System;
using System.Collections;
using System.Collections.Generic;

using Rhino;
using Rhino.Geometry;

using Grasshopper;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Data;
using Grasshopper.Kernel.Types;

using System.IO;

/// <summary>
/// This class will be instantiated on demand by the Script component.
/// </summary>
public class Script_Instance : GH_ScriptInstance
{
#region Utility functions
  /// <summary>Print a String to the [Out] Parameter of the Script component.</summary>
  /// <param name="text">String to print.</param>
  private void Print(string text) { /* Implementation hidden. */ }
  /// <summary>Print a formatted String to the [Out] Parameter of the Script component.</summary>
  /// <param name="format">String format.</param>
  /// <param name="args">Formatting parameters.</param>
  private void Print(string format, params object[] args) { /* Implementation hidden. */ }
  /// <summary>Print useful information about an object instance to the [Out] Parameter of the Script component. </summary>
  /// <param name="obj">Object instance to parse.</param>
  private void Reflect(object obj) { /* Implementation hidden. */ }
  /// <summary>Print the signatures of all the overloads of a specific method to the [Out] Parameter of the Script component. </summary>
  /// <param name="obj">Object instance to parse.</param>
  private void Reflect(object obj, string method_name) { /* Implementation hidden. */ }
#endregion

#region Members
  /// <summary>Gets the current Rhino document.</summary>
  private readonly RhinoDoc RhinoDocument;
  /// <summary>Gets the Grasshopper document that owns this script.</summary>
  private readonly GH_Document GrasshopperDocument;
  /// <summary>Gets the Grasshopper script component that owns this script.</summary>
  private readonly IGH_Component Component;
  /// <summary>
  /// Gets the current iteration count. The first call to RunScript() is associated with Iteration==0.
  /// Any subsequent call within the same solution will increment the Iteration count.
  /// </summary>
  private readonly int Iteration;
#endregion

  /// <summary>
  /// This procedure contains the user code. Input parameters are provided as regular arguments,
  /// Output parameters as ref arguments. You don't have to assign output parameters,
  /// they will have a default value.
  /// </summary>
  private void RunScript(List<Mesh> InMesh, bool Execute, ref object OutMesh, ref object Json)
  {
    List<Mesh> Raw_Mesh = InMesh;
    if(Execute == true)
    {
      string json = MultiMeshData(Raw_Mesh);
      WriteJsonToFile(json);

      Json = json;
      OutMesh = Raw_Mesh;
    }
  }

  // <Custom additional code> 
  public string SingleMeshData(Mesh mesh)
  {
    //Regulate mesh
    mesh.Normals.ComputeNormals();
    mesh.Faces.ConvertQuadsToTriangles();

    //Set up outputs
    List<double> positions = new List<double>();
    List<double> normals = new List<double>();
    List<int> colours = new List<int>();
    List<int> indicice = new List<int>();

    //Populate raw data
    for(int i = 0; i < mesh.Vertices.Count; i++)
    {
      positions.Add(mesh.Vertices[i].X);
      positions.Add(mesh.Vertices[i].Z);
      positions.Add(-mesh.Vertices[i].Y);

      normals.Add(mesh.Normals[i].X);
      normals.Add(mesh.Normals[i].Z);
      normals.Add(-mesh.Normals[i].Y);

      if(mesh.VertexColors.Count < mesh.Vertices.Count)
      {
        colours.Add(245);
        colours.Add(235);
        colours.Add(225);
      }
      else
      {
        colours.Add(mesh.VertexColors[i].R);
        colours.Add(mesh.VertexColors[i].G);
        colours.Add(mesh.VertexColors[i].B);
      }
    }
    for(int i = 0; i < mesh.Faces.Count; i++)
    {
      indicice.Add(mesh.Faces[i].A);
      indicice.Add(mesh.Faces[i].B);
      indicice.Add(mesh.Faces[i].C);
    }

    //Convert data to string
    string str_vertex = "\"vertex\":[" + string.Join(",", positions) + "]";
    string str_normal = "\"normal\":[" + string.Join(",", normals) + "]";
    string str_colour = "\"colour\":[" + string.Join(",", colours) + "]";
    string str_index = "\"index\":[" + string.Join(",", indicice) + "]";
    string output = "{" + string.Join(",", new string[4]{str_vertex, str_normal, str_colour, str_index}) + "}";
    return output;
  }

  public string MultiMeshData (List<Mesh> mesh_list)
  {
    List<string> multi_mesh_data = new List<string>();
    foreach(Mesh mesh in mesh_list)
    {
      multi_mesh_data.Add(SingleMeshData(mesh));
    }
    string output = "{\"mesh_export\":[" + string.Join(",", multi_mesh_data) + "]}";
    return output;
  }

  public void WriteJsonToFile(string jsondata)
  {
    string output = "data=\'" + jsondata + "\'";
    string desktop = Environment.GetFolderPath(Environment.SpecialFolder.Desktop) + "\\";
    File.WriteAllText(desktop + "model_data.js", output);
  }
  // </Custom additional code> 
}