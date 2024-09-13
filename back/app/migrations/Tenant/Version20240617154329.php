<?php

declare(strict_types=1);

namespace DoctrineMigrations\Tenant;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240617154329 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE CalendarEvent (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, description VARCHAR(255) DEFAULT NULL, beginDate BIGINT NOT NULL, endDateMillis BIGINT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE CalendarEventInvitation (id INT AUTO_INCREMENT NOT NULL, memberId INT NOT NULL, status INT NOT NULL, calendarEvent_id INT NOT NULL, INDEX IDX_9192CD8B9EBE1067 (calendarEvent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE CalendarEventInvitation ADD CONSTRAINT FK_9192CD8B9EBE1067 FOREIGN KEY (calendarEvent_id) REFERENCES CalendarEvent (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE CalendarEventInvitation DROP FOREIGN KEY FK_9192CD8B9EBE1067');
        $this->addSql('DROP TABLE CalendarEvent');
        $this->addSql('DROP TABLE CalendarEventInvitation');
    }
}
