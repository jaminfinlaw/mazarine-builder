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

## Export verification required

The web asset must retain these source occurrence names in its GLTF node hierarchy. The final mapping in `lib/cad-components.ts` must be updated from the exported GLB node names after the conversion completes. No alias or guessed node name is used in the running viewer before that verification.
