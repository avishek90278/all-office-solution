const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

class JobQueue extends EventEmitter {
    constructor() {
        super();
        this.jobs = new Map();
        this.processing = false;
    }

    add(type, data) {
        const id = uuidv4();
        const job = {
            id,
            type,
            data,
            status: 'pending',
            createdAt: new Date(),
            result: null,
            error: null
        };
        this.jobs.set(id, job);
        this.emit('jobAdded', id);
        this.processNext();
        return id;
    }

    get(id) {
        return this.jobs.get(id);
    }

    async processNext() {
        if (this.processing) return;

        const nextJob = Array.from(this.jobs.values()).find(j => j.status === 'pending');
        if (!nextJob) return;

        this.processing = true;
        nextJob.status = 'processing';
        this.emit('jobStarted', nextJob.id);

        try {
            // Simulate processing delay or call actual module
            console.log(`Processing job ${nextJob.id} (${nextJob.type})...`);

            // Here we would switch on job type and call respective module
            // For now, just simulate success after 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));

            nextJob.result = { success: true, message: 'Processed via Queue' };
            nextJob.status = 'completed';
            this.emit('jobCompleted', nextJob.id);
        } catch (error) {
            nextJob.error = error.message;
            nextJob.status = 'failed';
            this.emit('jobFailed', nextJob.id);
        } finally {
            this.processing = false;
            this.processNext();
        }
    }
}

module.exports = new JobQueue();
