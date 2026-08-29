# Taxonomy guide

`library/taxonomy.yaml` is the source of truth. A case selects one or more identifiers in every dimension; categories are not folders because a single prompt often has several valid ways to be discovered.

## How to classify a case

1. **Deliverable** describes the user's finished artifact, not its style. A product poster can use `product-commerce` and `poster-editorial`.
2. **Medium** describes the requested visual language. Select `mixed-media` only when the combination matters to the result.
3. **Workflow** describes the inputs and editing path. Include `inpainting` only when a constrained local edit is part of the method.
4. **Capability** records the hard part worth learning from the case.
5. **Model** names compatible dialects. Include `universal` only when no target-specific syntax is required.

Use tags for narrow concepts such as `beverage`, `isometric`, or `retail`. Tags aid discovery but are not stable taxonomy identifiers.

## Adding categories

Open an issue before adding a taxonomy ID. New categories must be broadly useful, non-overlapping, and expected to contain several cases. Existing IDs are immutable because external tools may index them.
