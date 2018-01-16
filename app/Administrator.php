<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Notifications\ResetPassLink;
class Administrator extends Authenticatable
{

    use Notifiable;
    use SoftDeletes;
    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    protected $primaryKey = 'administrator_id';

    protected $hidden = [

        USED_COMPANY_ID, REMEMBER_TOKEN, DELETED_AT

    ];

    protected $fillable = [
        ADMINISTRATOR_EMAIL, PASSWORD
    ];

    public function usedCompany()
    {
        return $this->belongsTo('App\UsedCompany', 'used_company_id');
    }
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPassLink($token));
    }
}
