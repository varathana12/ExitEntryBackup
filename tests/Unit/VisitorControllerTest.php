<?php
/**
 * Created by PhpStorm.
 * User: sereiponna
 * Date: 12/9/17
 * Time: 10:08 AM
 */

namespace Tests\Unit;

use App\Http\Controllers\VisitorController;
use Tests\TestCase;

class VisitorControllerTest extends TestCase
{

    public function testToHalfWidth() {
        $vc = new VisitorController();
        $this->assertEquals('HalfWidth', $vc->toHalfWidth('ＨａｌｆＷｉｄｔｈ'), 'wrong conversion');
    }

    public function testFilterPhoneNumber() {

    }
}
