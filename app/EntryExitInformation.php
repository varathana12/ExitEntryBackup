<?php

namespace App;

class EntryExitInformation extends BaseModel
{
    protected $table = 'entry_exit_informations';

    protected $primaryKey = 'entry_exit_information_id';

    protected $hidden = [
        'used_company_id', 'update_manager_id', 'deleted_at'
    ];

    protected $fillable = [
        'member_id', 'number_of_visitor', 'entry_datetime', 'exit_datetime', 'exit_confirmer_id'
    ];

    public function visitor()
    {
        return $this->belongsTo('App\Visitor', 'member_id');
    }

    public function usedCompany()
    {
        return $this->belongsTo('App\UsedCompany', 'used_company_id');
    }
}
