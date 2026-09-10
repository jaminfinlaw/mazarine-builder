# MAZARINE CAD Component Map

## Source files

- Preferred hierarchy source: `public/models/2.5 assembly.f3z`
- Geometry export source: `public/models/2.5 assembly_.step`

The F3Z archive is the authoritative component hierarchy source. It contains the root `2.5 assembly.f3d` and referenced Fusion documents. STEP is being used for a browser mesh export because it is supported by the available headless converter.

## Confirmed Fusion occurrences

| Fusion occurrence | Configurator mapping | Expected visibility |
| --- | --- | --- |
| `royal lid 2.0` | lid | Always visible; animated about hinge after export calibration. |
| `Lid-Modified-12-22-22` | insideCover | Always visible; follows lid. |
| `curent AVC Vent Covers` | avc | Always visible. |
| `sign 2` | frontSign or rearSign | Optional; exact side requires GLB node inspection. |
| `wet bar` | teakPopUpBar | Optional. |
| `upper 1/4 basket` | storageSystem | Optional. |
| `upper 1/2 basket` | storageSystem | Optional. |
| `lower 1/2 basket` | storageSystem | Optional. |
| `hanger bar` | Unknown accessory | Not currently mapped. |
| `humidor` | Unknown accessory | Not currently mapped. |
| `L 6 tank holder` | Unknown accessory | Not currently mapped. |
| `R 6 tank holder` | Unknown accessory | Not currently mapped. |
| `latch assembly part 1` | hinges/hardware | Always visible. |
| `latch assembly part 6` | hinges/hardware | Always visible. |
| `updated latch assembly` | hinges/hardware | Always visible. |
| `3.0` | body candidate | Requires GLB export node inspection. |

## Exported GLB hierarchy

`mazarine-assembly.glb` is now the active viewer asset. Its complete export hierarchy is:

```text
Scene
	Node0 (Object3D)
		Node1 (Mesh)
			Node2 (Mesh)
				Node3 (Mesh)
					Node4 (Mesh)
						Node5 (Mesh)
							Node6 (Mesh)
								Node7 (Mesh)
									Node8 (Mesh)
										Node9 (Mesh)
											Node10 (Mesh)
												Node11 (Mesh)
													Node12 (Mesh)
														Node13 (Mesh)
															Node14 (Mesh)
																Node15 (Mesh)
																	Node16 (Mesh)
																		Node17 (Mesh)
																			Node18 (Mesh)
																				Node19 (Mesh)
																					Node20 (Mesh)
																						Node21 (Mesh)
																							Node22 (Mesh)
```

The exporter stripped every Fusion occurrence name and stored all child mesh transforms at `[0, 0, 0]`.

No exported node can therefore be factually associated with a Fusion occurrence. `lib/cad-components.ts` records these mappings as `ambiguous-export`; real-CAD visibility toggles and a real-lid hinge animation require a re-export retaining occurrence names.
