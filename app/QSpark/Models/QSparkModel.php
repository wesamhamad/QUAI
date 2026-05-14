<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model as EloquentModel;

/**
 * Base model for the merged QSPARK app. Binds every QSPARK model to the
 * dedicated `qspark` database connection so QSPARK's schema stays isolated
 * from QUAI's tables. See config/database.php and database/migrations/qspark.
 */
abstract class QSparkModel extends EloquentModel
{
    protected $connection = 'qspark';
}
