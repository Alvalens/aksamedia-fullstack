<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Division;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 0; $i < 50; $i++) {
            Employee::create([
                'id' => Str::uuid(),
                'name' => $faker->name,
                'phone' => $faker->phoneNumber,
                'division_id' => Division::inRandomOrder()->value('id'),
                'position' => $faker->jobTitle,
                'image' => null,
            ]);
        }
    }
}
