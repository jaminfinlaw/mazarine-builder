# MAZARINE CAD Asset Expectations

This project is intentionally structured to accept the real MAZARINE CAD-derived geometry when it is available.

## Expected filenames

Place final production geometry in the following files under this directory:

- body.glb
- lid.glb
- interior-cover.glb
- ventilation-insert.glb

Optional additional component files used for assembly calibration:

- signage-front.glb
- signage-rear.glb
- storage-system.glb
- divider-acrylic.glb

## Placeholder note

The current repository does not contain the actual MAZARINE CAD assembly or final GLB export. The app includes a realistic placeholder viewer foundation, but final assembly transforms and geometry must be calibrated from the real CAD source before production use.

## Coordinate and assembly guidance

The STEP/CAD source may not share a common origin or orientation. When the actual CAD geometry is added, set explicit transforms in the centralized assembly config before production release. The app is prepared for this via the assembly transform layer, but final calibration is still required from the real CAD assembly.
