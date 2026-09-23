<?php

namespace App\Models;

/**
 * The vocabulary of the advising actions log — demo build.
 *
 * The live platform stores these rows in `advising_actions`; this build keeps
 * only the constants the proactive-advising board's partials read, and the
 * synthetic log itself lives in App\Services\Advising\AdvisingBoardData.
 */
final class AdvisingAction
{
    public const TYPE_SCHEDULED = 'scheduled';
    public const TYPE_TEAMS_CREATED = 'teams_meeting_created';
    public const TYPE_EMAIL_STUDENT = 'email_student';
    public const TYPE_EMAIL_ADVISOR = 'email_advisor';
    public const TYPE_PLATFORM_NOTIFICATION = 'platform_notification';
    public const TYPE_RESCHEDULED = 'rescheduled';
    public const TYPE_CANCELLED = 'cancelled';
    public const TYPE_HELD = 'held';
    public const TYPE_NO_SHOW = 'no_show';
    public const TYPE_OUTCOME_MEASURED = 'outcome_measured';

    public const STATUS_DONE = 'done';
    public const STATUS_FAILED = 'failed';
    public const STATUS_SKIPPED = 'skipped';

    public const CHANNEL_SYSTEM = 'system';
    public const CHANNEL_TEAMS = 'teams';
    public const CHANNEL_EMAIL = 'email';
    public const CHANNEL_PLATFORM = 'platform';

    public const TYPE_LABELS = [
        self::TYPE_SCHEDULED => 'جُدول موعد',
        self::TYPE_TEAMS_CREATED => 'أُنشئ اجتماع Teams',
        self::TYPE_EMAIL_STUDENT => 'بريد للطالب',
        self::TYPE_EMAIL_ADVISOR => 'بريد للمرشد',
        self::TYPE_PLATFORM_NOTIFICATION => 'تنبيه على المنصة',
        self::TYPE_RESCHEDULED => 'أُعيدت الجدولة',
        self::TYPE_CANCELLED => 'أُلغي الموعد',
        self::TYPE_HELD => 'انعقد اللقاء',
        self::TYPE_NO_SHOW => 'لم يحضر',
        self::TYPE_OUTCOME_MEASURED => 'قيس الأثر',
    ];
}
