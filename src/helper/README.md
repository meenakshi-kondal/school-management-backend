1. **PipelineStage**: 
    In some MongoDB queries, we used PipelineStage because without it, an error was shown on 'user.name'.
    This happened because we had already used a $match stage, and when we added another $match after $lookup, TypeScript started showing an error.
    This is a TypeScript error, not a MongoDB error. When TypeScript analyzes the code, it creates a fixed interface based on the initial pipeline structure.
    When we later push a new $match with different fields, TypeScript throws an error.
    To resolve this, we used PipelineStage, which tells TypeScript that the aggregation pipeline can contain multiple stages of the same type.
    Therefore, we use the PipelineStage interface here.
    Example:
         const pipeline:  PipelineStage[] = [
            {
                $match: {
                    status,
                    is_deleted: 0
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' }
        ]

        if (search && search.trim() !== '') {
            pipeline.push({
                $match: {
                   "user.name": { $regex: search, $options: 'i'} 
                }
            });
        }